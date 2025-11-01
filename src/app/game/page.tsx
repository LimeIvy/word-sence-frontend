"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";

/**
 * ゲーム開始ページ
 * ルーム作成・参加のエントリーポイント
 */
export default function GamePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const createRoom = useMutation(api.room.createRoom);
  const joinRoom = useMutation(api.room.joinRoom);
  const myRoom = useQuery(api.room.getMyRoom);
  const user = useQuery(api.user.getMyUser);
  const activeBattles = useQuery(
    api.battle.getUserBattles,
    user ? { userId: user._id } : "skip"
  );

  // アクティブなルームがある場合はリダイレクト
  useEffect(() => {
    if (myRoom) {
      router.push(`/battle/room/${myRoom._id}`);
    }
  }, [myRoom, router]);

  // アクティブなバトルがある場合はリダイレクト
  useEffect(() => {
    if (activeBattles && activeBattles.length > 0) {
      const activeBattle = activeBattles.find((b) => b.game_status === "active");
      if (activeBattle) {
        router.push(`/battle/${activeBattle._id}`);
      }
    }
  }, [activeBattles, router]);

  // ローディング状態
  if (user === undefined || myRoom === undefined) {
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
    router.push("/signin");
    return null;
  }

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setJoinError(null);
    try {
      const result = await createRoom();
      router.push(`/battle/room/${result.roomId}`);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : "ルーム作成に失敗しました");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setJoinError("ルームコードを入力してください");
      return;
    }

    setIsJoining(true);
    setJoinError(null);
    try {
      const result = await joinRoom({ roomCode: roomCode.trim().toUpperCase() });
      router.push(`/battle/room/${result.roomId}`);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : "ルームに参加できませんでした");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">ゲーム開始</h1>
          <p className="text-gray-600 dark:text-gray-400">対戦を開始する方法を選択してください</p>
        </div>

        <div className="space-y-6">
          {/* ルーム作成 */}
          <div className="space-y-4">
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating || isJoining}
              size="lg"
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  作成中...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  新しいルームを作成
                </>
              )}
            </Button>
          </div>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                または
              </span>
            </div>
          </div>

          {/* ルーム参加 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomCode" className="text-sm font-medium">
                ルームコードを入力
              </label>
              <Input
                id="roomCode"
                type="text"
                placeholder="例: ABC123"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setJoinError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinRoom();
                  }
                }}
                disabled={isCreating || isJoining}
                className="text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleJoinRoom}
              disabled={isCreating || isJoining || !roomCode.trim()}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  参加中...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  ルームに参加
                </>
              )}
            </Button>

            {joinError && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
                {joinError}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

