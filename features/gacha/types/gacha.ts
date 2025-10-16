export interface GachaCard {
  text: string;
  rarity: string;
  card_number: string;
}

export interface GachaResult {
  card: GachaCard;
}

export interface GachaResultProps {
  result: GachaResult | null;
}
