import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { DischargeCard } from "../../../features/gacha/components/dischargeCard";
import { Header } from "../../../features/gacha/components/header";

export default function Gacha() {
  return (
    <div className="flex flex-col min-h-screen bg-washi font-serif">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-8">
        <DischargeCard />
        <Button className="text-2xl font-bold px-12 py-8 rounded-full">
          <Star className="size-8 animate-pulse" />
          <span>ガチャを引く</span>
        </Button>
      </main>
    </div>
  );
}
