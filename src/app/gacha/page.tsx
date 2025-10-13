import { Button } from "@/components/ui/button";
import AllCardList from "../../../features/gacha/components/allCardList";

export default function Gacha() {
  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <AllCardList />
      <Button className="mt-4 text-2xl px-4 py-6 rounded-full">ガチャを引く</Button>
    </div>
  );
}
