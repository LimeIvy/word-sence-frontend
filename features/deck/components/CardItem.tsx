import { WordCard } from "../../common/components/wordCard";
import { OwnedCardWithDetail } from "../types/deck";
import { mapRarityToJapanese } from "../utils/rarity-utils";

// カード表示コンポーネント
export function CardItem({ ownedCard }: { ownedCard: OwnedCardWithDetail }) {
  const japaneseRarity = mapRarityToJapanese(ownedCard.card.rarity);

  return (
    <WordCard
      className="aspect-3/4 w-20 sm:w-24 md:w-30 lg:w-36 transition-transform duration-300 hover:scale-110"
      rarity={japaneseRarity}
      cardId={ownedCard.card.id}
    >
      {ownedCard.card.name}
    </WordCard>
  );
}
