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
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer" style={{ userSelect: "none" }}>
      <CardItem ownedCard={ownedCard} />
    </div>
  );
}
