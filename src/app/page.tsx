import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="w-1/2 flex items-center justify-center mx-auto">
        <Image src="/wordsence.png" alt="logo" width={700} height={700} className="object-cover" />
      </div>
      <div className="flex items-center justify-center w-1/2">
        <Button>Click me</Button>
      </div>
    </div>
  );
}
