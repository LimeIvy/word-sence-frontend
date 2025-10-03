import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BuildDeckPosition from "../../../features/deck/components/BuildDeckPosition";
import CardOwnership from "../../../features/deck/components/CardOwnership";
export default function Deck() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <header className="h-20 flex items-center justify-start">
        <Link
          href="/"
          className="rounded-full p-2 border border-primary/30 bg-white/90 text-xl shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-103 active:scale-90"
        >
          <ArrowLeft className="size-10" />
        </Link>
      </header>
      <main className="flex items-center justify-center gap-2 mt-3">
        {/* デッキ編成 */}
        <BuildDeckPosition />

        {/* 所持カード */}
        <CardOwnership />
      </main>
    </div>
  );
}
