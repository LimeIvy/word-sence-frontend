import { Button } from "@/components/ui/button";
import { BookOpen, BookPlus, Coins, Settings, ShoppingCart, Swords } from "lucide-react";
import Image from "next/image";

const menu = [
  {
    name: "ゲーム開始",
    icon: <Swords className="size-10" />,
  },
  {
    name: "マイデッキ",
    icon: <BookPlus className="size-10" />,
  },
  {
    name: "マーケット",
    icon: <ShoppingCart className="size-10" />,
  },
];

const subMenu = [
  {
    name: "ガチャ",
    icon: <Coins className="size-10" />,
  },
  {
    name: "ルール",
    icon: <BookOpen className="size-6" />,
  },
  {
    name: "設定",
    icon: <Settings className="size-6" />,
  },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/2 flex items-center justify-center mx-auto">
        <Image src="/wordsence.png" alt="logo" width={700} height={700} className="object-cover" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 gap-4">
        {menu.map((item) => (
          <Button
            key={item.name}
            className="h-[calc(15vh-10px)] w-[calc(30vw-10px)] overflow-hidden rounded-lg shadow-2xl bg-primary px-5 py-3 text-xl font-bold text-white transition-all duration-200 hover:bg-primary/95 active:scale-90 hover:ring-2 hover:ring-primary hover:ring-offset-2"
          >
            {item.icon}
            {item.name}
          </Button>
        ))}
        <div className="flex items-center justify-center w-1/2 gap-4">
          {subMenu.map((item) => (
            <Button
              key={item.name}
              className="h-[calc(15vh-10px)] w-[calc(30vw-10px)] overflow-hidden rounded-lg shadow-2xl bg-primary px-5 py-3 text-xl font-bold text-white transition-all duration-200 hover:bg-primary/95 active:scale-90 hover:ring-2 hover:ring-primary hover:ring-offset-2 flex flex-col items-center justify-center gap-2"
            >
              <span>{item.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
