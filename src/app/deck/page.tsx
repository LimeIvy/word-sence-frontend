import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BuildDeck from "../../../features/deck/components/BuildDeck";

export default function Deck() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-[10vh] flex items-center justify-start mt-5 ml-10 mb-6">
        <Link
          href="/"
          className="rounded-full p-2 border border-primary/30 bg-white/90 text-xl shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-103 active:scale-90"
        >
          <ArrowLeft className="size-10" />
        </Link>
      </header>
      <main className="h-[90vh]">
        {/* デッキ編成 */}
        <BuildDeck />
      </main>
    </div>
  );
}
