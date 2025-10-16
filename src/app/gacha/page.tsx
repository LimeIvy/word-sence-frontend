import { GachaController } from "../../../features/gacha/components/GachaController";
import { Header } from "../../../features/gacha/components/header";

export default function Gacha() {
  return (
    <div className="flex flex-col min-h-screen bg-washi font-serif">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-8">
        <GachaController />
      </main>
    </div>
  );
}
