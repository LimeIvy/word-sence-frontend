import { Button } from "@/components/ui/button";
import { BookOpen, BookPlus, Settings, ShoppingCart, Star, Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    icon: <Star className="size-6" />,
    href: "/gacha",
  },
  {
    name: "ルール",
    icon: <BookOpen className="size-6" />,
    href: "/rule",
  },
  {
    name: "設定",
    icon: <Settings className="size-6" />,
    href: "/setting",
  },
];

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <section className="grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <figure>
            <Image
              src="/wordsence.png"
              alt="ロゴ"
              width={640}
              height={640}
              className="object-contain drop-shadow-xl"
            />
            <figcaption className="sr-only">Word Sence のロゴ</figcaption>
          </figure>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          {menu.map((item) => (
            <Button
              key={item.name}
              className="h-[calc(15vh-10px)] w-full max-w-md overflow-hidden rounded-md border border-primary/30 bg-white/90 px-6 py-4 text-xl font-semibold font-serif tracking-wider text-foreground shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 active:scale-95"
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Button>
          ))}
          <nav aria-label="サブメニュー" className="mt-2">
            <ul className="grid grid-cols-3 items-center justify-center gap-4">
              {subMenu.map((item) => (
                <li key={item.name} className="flex items-center justify-center">
                  <Link
                    href={item.href}
                    className="flex aspect-square w-20 items-center justify-center rounded-full border border-primary/30 bg-white/90 text-sm font-serif tracking-wider shadow-sm transition-colors hover:border-primary/60 hover:bg-primary/10"
                    aria-label={item.name}
                  >
                    <span className="mr-1">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
