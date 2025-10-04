import { Card } from "../../common/components/card";
import { OwnedCardWithDetail } from "../types/deck";
import { mapRarityToJapanese } from "../utils/rarity-utils";

// カード表示コンポーネント
export function CardItem({ ownedCard }: { ownedCard: OwnedCardWithDetail }) {
  const japaneseRarity = mapRarityToJapanese(ownedCard.card.rarity);

  return (
    <Card
      className="aspect-3/4 w-20 sm:w-24 md:w-30 lg:w-36"
      rarity={japaneseRarity}
      cardId={ownedCard.card.id}
    >
      <div className="p-1 text-center break-words text-xs sm:text-sm md:text-base lg:text-lg">
        {ownedCard.card.name}
      </div>
    </Card>
  );
}
