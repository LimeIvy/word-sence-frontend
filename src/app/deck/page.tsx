"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateNewDeckModal } from "../../../features/deck/components/CreateNewDeckModal";
import { DeckList } from "../../../features/deck/components/DeckList";

export default function Deck() {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* 背景 - 和紙テクスチャ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,248,235,0.98) 0%, rgba(255,245,230,0.95) 50%, rgba(250,240,220,0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(245,230,200,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(240,220,180,0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(235,215,175,0.15) 0%, transparent 60%)
          `,
          backgroundSize: "300px 300px, 350px 350px, 250px 250px",
        }}
      />

      {/* 装飾的な桜 */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-pulse select-none z-0">
        🌸
      </div>
      <div className="absolute top-20 right-20 text-3xl opacity-20 animate-pulse delay-150 select-none z-0">
        🌸
      </div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-pulse delay-300 select-none z-0">
        🌸
      </div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-pulse delay-450 select-none z-0">
        🌸
      </div>

      <div className="relative z-10">
        <header className="h-[10vh] flex items-center justify-start mt-5 ml-10 mb-6">
          <Link href="/" className="block">
            <div
              className="relative rounded-full p-2 transition-all duration-200 overflow-hidden select-none"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                border: "2px solid rgba(218,165,32,0.6)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
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
                className="absolute inset-0 opacity-10 rounded-full"
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
              <ArrowLeft className="size-10 text-amber-50 relative z-10" />
            </div>
          </Link>
        </header>
        <main className="flex flex-col">
          <CreateNewDeckModal />
          <div>
            <DeckList />
          </div>
        </main>
      </div>
    </div>
  );
}
