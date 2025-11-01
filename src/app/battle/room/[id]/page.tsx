"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { Check, Copy, Loader2, LogOut, Play, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

/**
 * ルーム待機ページ
 * 参加者が待機し、デッキを選択する
 */
export default function RoomWaitingPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as Id<"game_room"> | undefined;
  const [selectedDeckId, setSelectedDeckId] = useState<Id<"deck"> | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSelectingDeck, setIsSelectingDeck] = useState(false);
  const [copied, setCopied] = useState(false);

  const room = useQuery(api.room.getRoom, roomId ? { roomId } : "skip");
  const user = useQuery(api.user.getMyUser);
  const userDecks = useQuery(api.deck.getUserDecks);
  const selectDeck = useMutation(api.room.selectDeck);
  const leaveRoom = useMutation(api.room.leaveRoom);
  const startBattle = useMutation(api.room.startBattle);

  // 認証チェック
  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  // バトルIDが存在する場合はバトルページにリダイレクト
  useEffect(() => {
    if (room?.battle_id && room.is_active) {
      router.push(`/battle/${room.battle_id}`);
    }
  }, [room, router]);

  // ルームが見つからない場合
  useEffect(() => {
    if (room === null && user !== undefined) {
      router.push("/game");
    }
  }, [room, user, router]);

  // 選択済みデッキを設定
  useEffect(() => {
    if (room && user && room.player_decks) {
      const playerDecks = room.player_decks as Record<string, Id<"deck">>;
      const myDeckId = playerDecks[user._id];
      if (myDeckId) {
        setSelectedDeckId(myDeckId);
      }
    }
  }, [room, user]);

  // ローディング状態
  if (user === undefined || room === undefined || userDecks === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">読み込み中...</div>
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // 認証されていない場合
  if (!user) {
    return null;
  }

  // ルームが見つからない場合
  if (!room) {
    return null;
  }

  const isHost = room.host_id === user._id;
  const playerDecks = (room.player_decks as Record<string, Id<"deck">> | undefined) ?? {};
  const myDeckId = playerDecks[user._id];
  const opponentId = room.players.find((id: Id<"user">) => id !== user._id);
  const opponentDeckId = opponentId ? playerDecks[opponentId] : undefined;
  const canStartBattle = isHost && room.players.length === 2 && myDeckId && opponentDeckId;

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(room.room_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectDeck = async (deckId: Id<"deck">) => {
    if (!roomId) return;

    setIsSelectingDeck(true);
    try {
      await selectDeck({ roomId, deckId });
      setSelectedDeckId(deckId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "デッキ選択に失敗しました");
    } finally {
      setIsSelectingDeck(false);
    }
  };

  const handleStartBattle = async () => {
    if (!roomId || !canStartBattle) return;

    setIsStarting(true);
    try {
      const result = await startBattle({ roomId });
      router.push(`/battle/${result.battleId}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "バトル開始に失敗しました");
      setIsStarting(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomId) return;

    setIsLeaving(true);
    try {
      await leaveRoom({ roomId });
      router.push("/game");
    } catch (error) {
      alert(error instanceof Error ? error.message : "ルーム退出に失敗しました");
      setIsLeaving(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">対戦ルーム</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">ルームコード:</span>
            <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-lg font-bold">
              {room.room_code}
            </code>
            <button
              onClick={handleCopyRoomCode}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              aria-label="ルームコードをコピー"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 参加者情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              参加者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {room.players.map((playerId: Id<"user">) => {
                const isMe = playerId === user._id;
                const hasSelectedDeck = !!playerDecks[playerId];
                return (
                  <div
                    key={playerId}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      isMe ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{isMe ? "あなた" : "相手"}</span>
                      {isHost && playerId === room.host_id && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                          ホスト
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSelectedDeck ? (
                        <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          デッキ選択済み
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          デッキ選択待ち
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* デッキ選択 */}
        <Card>
          <CardHeader>
            <CardTitle>デッキを選択</CardTitle>
            <CardDescription>使用するデッキを選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            {userDecks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                デッキがありません。デッキ編成ページでデッキを作成してください。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDecks.map((deck: { _id: Id<"deck">; deck_name: string }) => (
                  <button
                    key={deck._id}
                    onClick={() => handleSelectDeck(deck._id)}
                    disabled={isSelectingDeck || selectedDeckId === deck._id}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedDeckId === deck._id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{deck.deck_name}</span>
                      {selectedDeckId === deck._id && (
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* アクション */}
        <div className="flex items-center justify-center gap-4">
          {isHost && canStartBattle && (
            <Button
              onClick={handleStartBattle}
              disabled={isStarting || isLeaving}
              size="lg"
              className="min-w-[200px]"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  開始中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  バトル開始
                </>
              )}
            </Button>
          )}

          {!isHost && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              ホストがバトルを開始するのをお待ちください
            </div>
          )}

          <Button
            onClick={handleLeaveRoom}
            disabled={isLeaving || isStarting}
            variant="outline"
            size="lg"
          >
            {isLeaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                退出中...
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-2" />
                退出
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
