import { GachaController } from "../../../features/gacha/components/GachaController";
import { Header } from "../../../features/gacha/components/header";

export default function Gacha() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden font-serif">
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
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-8">
          <GachaController />
        </main>
      </div>
    </div>
  );
}
