import { OwnedCardWithDetail } from "../types/deck";
import { CardItem } from "./CardItem";

// カードコンポーネント
export function CardComponent({
  ownedCard,
  onDoubleClick,
}: {
  ownedCard: OwnedCardWithDetail;
  onDoubleClick?: () => void;
}) {
  return (
    <div onDoubleClick={onDoubleClick}>
      <CardItem ownedCard={ownedCard} />
    </div>
  );
}
