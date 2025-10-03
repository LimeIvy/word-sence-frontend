import { BookOpen, BookPlus, Settings, ShoppingCart, Star, Swords } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
              className="object-contain"
            />
            <figcaption className="sr-only">Word Sence のロゴ</figcaption>
          </figure>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              className="h-[calc(15vh-10px)] w-full max-w-md overflow-hidden rounded-md border border-primary/30 bg-white/90 px-6 py-4 text-xl shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-103 active:scale-90 flex items-center justify-center"
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          <nav aria-label="サブメニュー" className="mt-2">
            <ul className="grid grid-cols-3 items-center justify-center gap-4">
              {subMenu.map((item) => (
                <li key={item.name} className="flex items-center justify-center">
                  <Link
                    href={item.href}
                    className="flex flex-col aspect-square w-20 items-center justify-center rounded-full border border-primary/30 bg-white/90 text-sm shadow-sm transition-all duration-200  hover:border-primary/60 hover:bg-primary/10 hover:scale-103 active:scale-90"
                    aria-label={item.name}
                  >
                    <span className="mb-1">{item.icon}</span>
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
