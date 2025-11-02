"use client";

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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 背景 - 和紙テクスチャ */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,245,230,0.2) 0%, transparent 60%)
            `,
            backgroundSize: "300px 300px, 350px 350px, 250px 250px",
          }}
        />
        <div className="relative text-center z-10">
          <div
            className="text-xl mb-4 select-none"
            style={{
              color: "#654321",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            読み込み中...
          </div>
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
    <main className="min-h-screen p-6 relative overflow-hidden">
      {/* 背景 - 和紙テクスチャ */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,245,230,0.2) 0%, transparent 60%)
          `,
          backgroundSize: "300px 300px, 350px 350px, 250px 250px",
        }}
      />

      {/* 装飾的な桜 */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse select-none">
        🌸
      </div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse delay-150 select-none">
        🌸
      </div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-pulse delay-300 select-none">
        🌸
      </div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse delay-450 select-none">
        🌸
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* ヘッダー - 和風背景 */}
        <div className="relative rounded-2xl p-8">
          {/* 和風背景 */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
              border: "3px solid rgba(101,67,33,0.6)",
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
            }}
          />

          {/* 縁装飾 */}
          <div
            className="absolute inset-x-0 top-0 h-2 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderBottom: "1px solid rgba(218,165,32,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderTop: "1px solid rgba(218,165,32,0.4)",
            }}
          />

          {/* 四隅の桜装飾 */}
          <div className="absolute top-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute top-3 right-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 right-3 text-lg opacity-20 select-none">🌸</div>

          {/* コンテンツ */}
          <div className="relative text-center">
            <h1
              className="text-4xl font-bold mb-4 select-none"
              style={{
                color: "#654321",
                textShadow: "0 2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(218,165,32,0.3)",
              }}
            >
              対戦ルーム
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span
                className="text-base select-none"
                style={{
                  color: "#8B4513",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                ルームコード:
              </span>
              <code
                className="px-4 py-2 rounded-lg font-mono text-xl font-bold select-none"
                style={{
                  background: "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                  border: "2px solid rgba(218,165,32,0.6)",
                  color: "#F5DEB3",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {room.room_code}
              </code>
              <button
                onClick={handleCopyRoomCode}
                className="p-2 rounded-lg transition-all hover:scale-110 select-none"
                style={{
                  background: copied
                    ? "linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.8))"
                    : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                  border: "2px solid rgba(218,165,32,0.6)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                aria-label="ルームコードをコピー"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Copy className="w-5 h-5 text-amber-50" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 参加者情報 - 和風背景 */}
        <div className="relative rounded-2xl p-6">
          {/* 和風背景 */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
              border: "3px solid rgba(101,67,33,0.6)",
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
            }}
          />

          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 rounded-2xl opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
              `,
              backgroundSize: "300px 300px, 350px 350px",
            }}
          />

          {/* 縁装飾 */}
          <div
            className="absolute inset-x-0 top-0 h-2 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderBottom: "1px solid rgba(218,165,32,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderTop: "1px solid rgba(218,165,32,0.4)",
            }}
          />

          {/* 四隅の桜装飾 */}
          <div className="absolute top-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute top-3 right-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 right-3 text-lg opacity-20 select-none">🌸</div>

          {/* コンテンツ */}
          <div className="relative">
            <div
              className="flex items-center gap-2 mb-4 select-none"
              style={{
                color: "#654321",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-bold">参加者</h2>
            </div>
            <div className="space-y-3">
              {room.players.map((playerId: Id<"user">) => {
                const isMe = playerId === user._id;
                const hasSelectedDeck = !!playerDecks[playerId];
                return (
                  <div
                    key={playerId}
                    className="relative flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg, rgba(218,165,32,0.15), rgba(184,134,11,0.2))"
                        : "linear-gradient(135deg, rgba(139,115,85,0.15), rgba(101,84,63,0.2))",
                      border: "2px solid rgba(101,67,33,0.4)",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold select-none"
                        style={{
                          color: "#654321",
                          textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                        }}
                      >
                        {isMe ? "あなた" : "相手"}
                      </span>
                      {isHost && playerId === room.host_id && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full select-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                            color: "#F5DEB3",
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                            border: "1px solid rgba(218,165,32,0.6)",
                          }}
                        >
                          ホスト
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSelectedDeck ? (
                        <span
                          className="text-sm flex items-center gap-1 select-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(218,165,32,0.9), rgba(184,134,11,0.8))",
                            color: "#F5DEB3",
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                            border: "1px solid rgba(218,165,32,0.6)",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Check className="w-4 h-4" />
                          デッキ選択済み
                        </span>
                      ) : (
                        <span
                          className="text-sm select-none"
                          style={{
                            color: "#8B4513",
                            textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                          }}
                        >
                          デッキ選択待ち
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* デッキ選択 - 和風背景 */}
        <div className="relative rounded-2xl p-6">
          {/* 和風背景 */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
              border: "3px solid rgba(101,67,33,0.6)",
              boxShadow:
                "inset 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(255,245,230,0.1), 0 8px 16px rgba(0,0,0,0.3)",
            }}
          />

          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 rounded-2xl opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,245,230,0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255,245,230,0.3) 0%, transparent 50%)
              `,
              backgroundSize: "300px 300px, 350px 350px",
            }}
          />

          {/* 縁装飾 */}
          <div
            className="absolute inset-x-0 top-0 h-2 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderBottom: "1px solid rgba(218,165,32,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2 rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderTop: "1px solid rgba(218,165,32,0.4)",
            }}
          />

          {/* 四隅の桜装飾 */}
          <div className="absolute top-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute top-3 right-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 left-3 text-lg opacity-20 select-none">🌸</div>
          <div className="absolute bottom-3 right-3 text-lg opacity-20 select-none">🌸</div>

          {/* コンテンツ */}
          <div className="relative">
            <h2
              className="text-xl font-bold mb-2 select-none"
              style={{
                color: "#654321",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              デッキを選択
            </h2>
            <p
              className="text-sm mb-4 select-none"
              style={{
                color: "#8B4513",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              使用するデッキを選択してください
            </p>
            {userDecks.length === 0 ? (
              <div
                className="text-center py-8 select-none"
                style={{
                  color: "#8B4513",
                  textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                デッキがありません。デッキ編成ページでデッキを作成してください。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDecks.map((deck: { _id: Id<"deck">; deck_name: string }) => {
                  const isSelected = selectedDeckId === deck._id;
                  return (
                    <button
                      key={deck._id}
                      onClick={() => handleSelectDeck(deck._id)}
                      disabled={isSelectingDeck || isSelected}
                      className="relative p-4 rounded-lg text-left transition-all overflow-hidden select-none"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(218,165,32,0.95), rgba(184,134,11,0.9))"
                          : "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                        border: isSelected
                          ? "2px solid rgba(218,165,32,0.8)"
                          : "2px solid rgba(218,165,32,0.6)",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.5)"
                          : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                        cursor: isSelectingDeck || isSelected ? "not-allowed" : "pointer",
                        opacity: isSelectingDeck || isSelected ? (isSelected ? 1 : 0.5) : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelectingDeck && !isSelected) {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelectingDeck && !isSelected) {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
                        }
                      }}
                    >
                      {/* 和紙テクスチャ */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `
                            repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 10px,
                              rgba(255,245,230,0.1) 10px,
                              rgba(255,245,230,0.1) 20px
                            )
                          `,
                        }}
                      />
                      <div className="relative flex items-center justify-between">
                        <span
                          className="font-semibold"
                          style={{
                            color: isSelected ? "#F5DEB3" : "#F5DEB3",
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {deck.deck_name}
                        </span>
                        {isSelected && <Check className="w-5 h-5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* アクション */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {isHost && canStartBattle && (
            <button
              onClick={handleStartBattle}
              disabled={isStarting || isLeaving}
              className="relative min-w-[200px] px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 overflow-hidden select-none"
              style={{
                background:
                  isStarting || isLeaving
                    ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                    : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                border:
                  isStarting || isLeaving
                    ? "2px solid rgba(100,100,100,0.6)"
                    : "2px solid rgba(218,165,32,0.6)",
                boxShadow:
                  isStarting || isLeaving
                    ? "0 2px 8px rgba(0,0,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                cursor: isStarting || isLeaving ? "not-allowed" : "pointer",
                opacity: isStarting || isLeaving ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isStarting && !isLeaving) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isStarting && !isLeaving) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
                }
              }}
            >
              {/* 和紙テクスチャ */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(255,245,230,0.1) 10px,
                      rgba(255,245,230,0.1) 20px
                    )
                  `,
                }}
              />
              <span
                className="relative text-amber-50"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                    開始中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 inline-block mr-2" />
                    バトル開始
                  </>
                )}
              </span>
            </button>
          )}

          {!isHost && (
            <div
              className="text-center px-6 py-4 rounded-lg select-none"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                border: "2px solid rgba(218,165,32,0.6)",
                color: "#F5DEB3",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              }}
            >
              ホストがバトルを開始するのをお待ちください
            </div>
          )}

          <button
            onClick={handleLeaveRoom}
            disabled={isLeaving || isStarting}
            className="relative px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 overflow-hidden select-none"
            style={{
              background:
                isLeaving || isStarting
                  ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                  : "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
              border:
                isLeaving || isStarting
                  ? "2px solid rgba(100,100,100,0.6)"
                  : "2px solid rgba(218,165,32,0.6)",
              boxShadow:
                isLeaving || isStarting
                  ? "0 2px 8px rgba(0,0,0,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              cursor: isLeaving || isStarting ? "not-allowed" : "pointer",
              opacity: isLeaving || isStarting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLeaving && !isStarting) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLeaving && !isStarting) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
              }
            }}
          >
            {/* 和紙テクスチャ */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,245,230,0.1) 10px,
                    rgba(255,245,230,0.1) 20px
                  )
                `,
              }}
            />
            <span
              className="relative text-amber-50"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              {isLeaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                  退出中...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 inline-block mr-2" />
                  退出
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
