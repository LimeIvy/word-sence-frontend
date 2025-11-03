export enum RarityEnum {
  Common = "common",
  Rare = "rare",
  SuperRare = "super_rare",
  Epic = "epic",
  Legendary = "legendary",
}

export interface GachaCard {
  text: string;
  rarity: RarityEnum;
  card_number: string;
}

export interface GachaResult {
  card: GachaCard;
}

export interface GachaResultProps {
  result: GachaResult | null;
}
