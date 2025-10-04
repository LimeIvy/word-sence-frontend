import { OwnedCardWithDetail } from "../types/deck";
import { CardItem } from "./CardItem";

// カードコンポーネント
export function CardComponent({
  ownedCard,
  onClick,
}: {
  ownedCard: OwnedCardWithDetail;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <CardItem ownedCard={ownedCard} />
    </div>
  );
}
