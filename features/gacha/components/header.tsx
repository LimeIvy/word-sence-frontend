import { ArrowLeft, CirclePoundSterling } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex items-center justify-between mt-5 mx-10 mb-6">
      <Link
        href="/"
        className="rounded-full p-2 border border-primary/30 bg-white/90 text-xl shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-103 active:scale-90"
        aria-label="ホームに戻る"
      >
        <ArrowLeft className="size-10" />
      </Link>
      <div className="flex items-center justify-center gap-2 rounded-xl p-3 border border-primary/30 bg-white/90 shadow-sm">
        <CirclePoundSterling className="size-8" />
        <span className="text-2xl font-bold">100</span>
      </div>
    </header>
  );
};
