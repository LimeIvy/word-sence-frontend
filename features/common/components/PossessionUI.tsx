import { CirclePoundSterling } from "lucide-react";
import Image from "next/image";

export const PossessionUI = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-2 rounded-xl p-3 border border-primary/30 bg-white/90 shadow-sm">
        <Image src="/cardicon.svg" alt="カード" width={32} height={32} />
        <span className="text-2xl font-bold">100</span>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl p-3 border border-primary/30 bg-white/90 shadow-sm">
        <CirclePoundSterling className="size-8" />
        <span className="text-2xl font-bold">100</span>
      </div>
    </div>
  );
};
