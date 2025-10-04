import { Card, UserCard } from "./card";

export type Deck = {
  id: number;
  user_id: string;
  name: string;
};

export type DeckCard = {
  id: number;
  deck_id: number;
  user_card_id: number;
  position: number;
};

// フロントエンドで使う結合型
export type OwnedCardWithDetail = UserCard & {
  card: Card;
};

export type DeckCardDetail = {
  position: number;
  user_card_id: number;
  card: Card;
};
