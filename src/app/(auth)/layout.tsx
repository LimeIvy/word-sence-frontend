import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      <div className="relative hidden md:flex md:col-span-2 lg:col-span-1">
        <Image
          src="/login-bg.jpg"
          alt="background image"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />
        <Link
          href="/"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative">
            <Image src="/wordsence.png" alt="Word Sense Logo" width={800} height={800} priority />
          </div>
        </Link>
      </div>
      <main className="flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
