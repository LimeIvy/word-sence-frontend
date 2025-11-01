import type { DeckCardDetail, OwnedCardWithDetail } from "../../common/types/card";

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

export type { DeckCardDetail, OwnedCardWithDetail };
