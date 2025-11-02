"use client";

import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { Home, Loader2, Plus, Users } from "lucide-react";
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
  const activeBattles = useQuery(api.battle.getUserBattles, user ? { userId: user._id } : "skip");

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
    <main className="flex items-center justify-center min-h-screen p-6 relative overflow-hidden">
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

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* タイトルエリア - 和風背景 */}
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
              className="text-4xl font-bold mb-3 select-none"
              style={{
                color: "#654321",
                textShadow: "0 2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(218,165,32,0.3)",
              }}
            >
              ゲーム開始
            </h1>
            <p
              className="text-base select-none"
              style={{
                color: "#8B4513",
                textShadow: "0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              対戦を開始する方法を選択してください
            </p>
          </div>
        </div>

        {/* メインコンテンツエリア - 和風背景 */}
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
          <div className="relative space-y-6">
            {/* ルーム作成 */}
            <div className="space-y-4">
              <button
                onClick={handleCreateRoom}
                disabled={isCreating || isJoining}
                className="relative w-full group flex items-center justify-center px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 overflow-hidden select-none"
                style={{
                  background:
                    isCreating || isJoining
                      ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                      : "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                  border:
                    isCreating || isJoining
                      ? "2px solid rgba(100,100,100,0.6)"
                      : "2px solid rgba(218,165,32,0.6)",
                  boxShadow:
                    isCreating || isJoining
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                  cursor: isCreating || isJoining ? "not-allowed" : "pointer",
                  opacity: isCreating || isJoining ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isCreating && !isJoining) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreating && !isJoining) {
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
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                      作成中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 inline-block mr-2" />
                      新しいルームを作成
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* 区切り線 - 和風 */}
            <div className="relative mt-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2" style={{ borderColor: "rgba(101,67,33,0.4)" }} />
              </div>
              <div className="relative flex justify-center text-sm z-10">
                <span
                  className="px-4 rounded-full select-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,69,19,0.95), rgba(101,67,33,0.9))",
                    color: "#F5DEB3",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    border: "2px solid rgba(218,165,32,0.6)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  または
                </span>
              </div>
            </div>

            {/* ルーム参加 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="roomCode"
                  className="text-sm font-semibold block select-none"
                  style={{
                    color: "#654321",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  ルームコードを入力
                </label>
                <div className="relative">
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
                    className="text-center text-lg font-mono tracking-wider bg-amber-50/80 border-2 rounded-lg py-3 select-none"
                    style={{
                      borderColor: "rgba(101,67,33,0.6)",
                      color: "#654321",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={isCreating || isJoining || !roomCode.trim()}
                className="relative w-full group flex items-center justify-center px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 overflow-hidden select-none"
                style={{
                  background:
                    isCreating || isJoining || !roomCode.trim()
                      ? "linear-gradient(135deg, rgba(75,75,75,0.9), rgba(50,50,50,0.9))"
                      : "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                  border:
                    isCreating || isJoining || !roomCode.trim()
                      ? "2px solid rgba(100,100,100,0.6)"
                      : "2px solid rgba(218,165,32,0.6)",
                  boxShadow:
                    isCreating || isJoining || !roomCode.trim()
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                  cursor: isCreating || isJoining || !roomCode.trim() ? "not-allowed" : "pointer",
                  opacity: isCreating || isJoining || !roomCode.trim() ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isCreating && !isJoining && roomCode.trim()) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreating && !isJoining && roomCode.trim()) {
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
                  {isJoining ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                      参加中...
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 inline-block mr-2" />
                      ルームに参加
                    </>
                  )}
                </span>
              </button>

              {joinError && (
                <div
                  className="text-sm text-center py-2 px-4 rounded-lg select-none"
                  style={{
                    background: "rgba(220,38,38,0.1)",
                    border: "2px solid rgba(220,38,38,0.3)",
                    color: "#DC2626",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  {joinError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ホームに戻るボタン */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="relative group flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 overflow-hidden select-none"
            style={{
              background: "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
              border: "2px solid rgba(218,165,32,0.6)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
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
              className="relative text-amber-50 flex items-center gap-2"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              <Home className="w-5 h-5" />
              ホームに戻る
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
