"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BookOpen,
  BookPlus,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShoppingCart,
  Star,
  Swords,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PossessionUI } from "../../features/common/components/PossessionUI";

const menu = [
  {
    name: "ゲーム開始",
    icon: <Swords className="size-10" />,
    href: "/game",
  },
  {
    name: "デッキ編成",
    icon: <BookPlus className="size-10" />,
    href: "/deck",
  },
  {
    name: "マーケット",
    icon: <ShoppingCart className="size-10" />,
    href: "/market",
  },
];

const subMenu = [
  {
    name: "ガチャ",
    icon: <Star className="size-6" />,
    href: "/gacha",
  },
  {
    name: "ルール",
    icon: <BookOpen className="size-6" />,
    href: null, // モーダルを開く
    modalType: "rule" as const,
  },
  {
    name: "設定",
    icon: <Settings className="size-6" />,
    href: null, // モーダルを開く
    modalType: "settings" as const,
  },
];

// ルール説明のスライド
const ruleSlides = [
  {
    title: "ゲームの目的",
    content:
      "お題カードに提示された単語に、手札のカードをベクトル演算で組み合わせて最も近い単語を作り出し、相手より高い類似度を獲得して勝利するゲームです。",
  },
  {
    title: "基本的な流れ",
    content:
      "1. お題カードが提示されます\n2. 手札からカードを選択してベクトル演算を行います\n3. 新しい単語を生成し、お題との類似度を計算します\n4. より高い類似度を獲得したプレイヤーが勝利です",
  },
  {
    title: "カードの使い方",
    content:
      "手札からカードを選択し、+ゾーンと-ゾーンに配置します。+ゾーンに配置したカードは加算、-ゾーンに配置したカードは減算されます。2〜5枚のカードを組み合わせて新しい単語を生成します。",
  },
  {
    title: "アクション",
    content:
      "• カード交換：手札を入れ替えることができます\n• 単語生成：ベクトル演算で新しい単語を作成します\n• 勝利宣言：自分の単語の方が高いと判断した場合に宣言します\n• コール/フォールド：勝利宣言に対する反応です",
  },
  {
    title: "勝利条件",
    content:
      "各ラウンドで、お題カードとの類似度が高いプレイヤーが勝利ポイントを獲得します。設定されたラウンド数を先取したプレイヤーが最終的な勝者となります。",
  },
];

export default function Home() {
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [bgmVolume, setBgmVolume] = useState(50);
  const [seVolume, setSeVolume] = useState(50);

  const handleRuleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRuleModalOpen(true);
    setCurrentSlideIndex(0);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSettingsModalOpen(true);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % ruleSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + ruleSlides.length) % ruleSlides.length);
  };

  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden">
      {/* 背景 - 和紙テクスチャ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,248,235,0.95) 0%, rgba(255,245,230,0.98) 50%, rgba(250,240,220,0.95) 100%)",
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

      {/* ヘッダー - 右上にカード枚数とジェム数 */}
      <header className="flex items-center justify-end mt-5 mx-10 mb-6 relative z-10">
        <PossessionUI />
      </header>

      {/* メインコンテンツ */}
      <section className="flex-1 flex items-center justify-center relative z-10">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
          {/* ロゴエリア */}
          <div className="flex items-center justify-center">
            <figure className="relative">
              <div className="absolute inset-0 rounded-2xl opacity-20">{/* 装飾的な枠 */}</div>
              <Image
                src="/wordsence.png"
                alt="ロゴ"
                width={640}
                height={640}
                className="object-contain relative z-10"
              />
              <figcaption className="sr-only">Word Sence のロゴ</figcaption>
            </figure>
          </div>

          {/* メニューエリア - 和風背景 */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* メインメニュー - 和風背景 */}
            <div className="relative w-full max-w-md rounded-2xl p-6">
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
              <div className="relative space-y-4">
                {menu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="relative group flex items-center justify-center gap-3 w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 overflow-hidden select-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                      border: "2px solid rgba(218,165,32,0.6)",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
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
                      className="relative text-amber-50"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.icon}
                    </span>
                    <span
                      className="relative text-amber-50"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* サブメニュー - 和風背景 */}
            <nav aria-label="サブメニュー" className="relative w-full max-w-md">
              <div className="relative rounded-2xl p-4">
                {/* 和風背景 */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(101,67,33,0.3))",
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

                {/* コンテンツ */}
                <ul className="relative grid grid-cols-3 items-center justify-center gap-4">
                  {subMenu.map((item) => (
                    <li key={item.name} className="flex items-center justify-center">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="relative flex flex-col aspect-square w-20 items-center justify-center rounded-full transition-all duration-200 overflow-hidden select-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                            border: "2px solid rgba(218,165,32,0.6)",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
                          }}
                          aria-label={item.name}
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
                          <span
                            className="relative mb-1 text-amber-50"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {item.icon}
                          </span>
                          <span
                            className="relative text-xs text-amber-50"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {item.name}
                          </span>
                        </Link>
                      ) : (
                        <button
                          onClick={
                            item.modalType === "rule" ? handleRuleClick : handleSettingsClick
                          }
                          className="relative flex flex-col aspect-square w-20 items-center justify-center rounded-full transition-all duration-200 overflow-hidden select-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                            border: "2px solid rgba(218,165,32,0.6)",
                            boxShadow:
                              "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                            e.currentTarget.style.boxShadow =
                              "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
                          }}
                          aria-label={item.name}
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
                          <span
                            className="relative mb-1 text-amber-50"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {item.icon}
                          </span>
                          <span
                            className="relative text-xs text-amber-50"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                          >
                            {item.name}
                          </span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* ルールモーダル */}
      <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,248,235,0.98), rgba(255,245,230,0.95))",
            border: "3px solid rgba(101,67,33,0.6)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
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
            className="absolute inset-x-0 top-0 h-2"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderBottom: "1px solid rgba(218,165,32,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2"
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

          <DialogHeader className="relative flex-shrink-0 px-8 pt-8 pb-4">
            <DialogTitle
              className="text-3xl font-bold text-center select-none"
              style={{
                color: "#654321",
                textShadow: "0 2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(218,165,32,0.3)",
              }}
            >
              ゲームルール
            </DialogTitle>
          </DialogHeader>

          {/* カルーセル */}
          <div className="relative flex-1 overflow-hidden px-8 pb-8">
            <div
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{
                transform: `translateX(-${currentSlideIndex * 100}%)`,
              }}
            >
              {ruleSlides.map((slide, index) => (
                <div
                  key={index}
                  className="min-w-full flex flex-col items-center justify-center px-4 py-8 h-full"
                >
                  <h3
                    className="text-2xl font-bold mb-6 text-center select-none"
                    style={{
                      color: "#8B4513",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                    }}
                  >
                    {slide.title}
                  </h3>
                  <div
                    className="text-base leading-relaxed whitespace-pre-line text-center select-none"
                    style={{
                      color: "#654321",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                    }}
                  >
                    {slide.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="relative flex items-center justify-between px-8 pb-8 flex-shrink-0">
            <button
              onClick={handlePrevSlide}
              className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all select-none"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                border: "2px solid rgba(218,165,32,0.6)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
              }}
            >
              <ChevronLeft
                className="w-6 h-6 text-amber-50"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              />
            </button>

            {/* スライドインジケーター */}
            <div className="flex gap-2">
              {ruleSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className="w-3 h-3 rounded-full transition-all select-none"
                  style={{
                    background:
                      index === currentSlideIndex ? "rgba(218,165,32,0.9)" : "rgba(139,115,85,0.4)",
                    border: "1px solid rgba(101,67,33,0.6)",
                    cursor: "pointer",
                  }}
                  aria-label={`スライド ${index + 1}に移動`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all select-none"
              style={{
                background: "linear-gradient(135deg, rgba(139,115,85,0.95), rgba(101,84,63,0.9))",
                border: "2px solid rgba(218,165,32,0.6)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,245,230,0.2), 0 0 8px rgba(218,165,32,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,245,230,0.2)";
              }}
            >
              <ChevronRight
                className="w-6 h-6 text-amber-50"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 設定モーダル */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent
          className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,248,235,0.98), rgba(255,245,230,0.95))",
            border: "3px solid rgba(101,67,33,0.6)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {/* 和紙テクスチャ */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
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
            className="absolute inset-x-0 top-0 h-2"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,69,19,0.8) 0%, rgba(101,67,33,0.9) 50%, rgba(139,69,19,0.8) 100%)",
              borderBottom: "1px solid rgba(218,165,32,0.4)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2"
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

          <DialogHeader className="relative flex-shrink-0 px-8 pt-8 pb-4">
            <DialogTitle
              className="text-3xl font-bold text-center select-none"
              style={{
                color: "#654321",
                textShadow: "0 2px 4px rgba(255,255,255,0.5), 0 0 8px rgba(218,165,32,0.3)",
              }}
            >
              設定
            </DialogTitle>
          </DialogHeader>

          {/* 設定コンテンツ */}
          <div className="relative flex-1 overflow-y-auto px-8 pb-8">
            <div className="space-y-6">
              {/* BGM設定 */}
              <div className="space-y-3">
                <label
                  className="text-lg font-semibold block select-none"
                  style={{
                    color: "#8B4513",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  BGM音量
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(218,165,32,0.8) 0%, rgba(218,165,32,0.8) ${bgmVolume}%, rgba(139,115,85,0.3) ${bgmVolume}%, rgba(139,115,85,0.3) 100%)`,
                      outline: "none",
                    }}
                  />
                  <span
                    className="text-base font-semibold w-12 text-right select-none"
                    style={{
                      color: "#654321",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                    }}
                  >
                    {bgmVolume}%
                  </span>
                </div>
              </div>

              {/* SE設定 */}
              <div className="space-y-3">
                <label
                  className="text-lg font-semibold block select-none"
                  style={{
                    color: "#8B4513",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  SE音量
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={seVolume}
                    onChange={(e) => setSeVolume(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(218,165,32,0.8) 0%, rgba(218,165,32,0.8) ${seVolume}%, rgba(139,115,85,0.3) ${seVolume}%, rgba(139,115,85,0.3) 100%)`,
                      outline: "none",
                    }}
                  />
                  <span
                    className="text-base font-semibold w-12 text-right select-none"
                    style={{
                      color: "#654321",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                    }}
                  >
                    {seVolume}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
