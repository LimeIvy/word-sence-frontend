export type Card = {
  id: string;
  name: string;
  rarity: string;
};

export type UserCard = {
  id: number;
  user_id: string;
  card_id: string;
  is_locked?: boolean;
};
