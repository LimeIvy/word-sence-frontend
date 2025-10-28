export type Card = {
  id: string;
  name: string;
  rarity: string;
  card_number: string;
};

export type UserCard = {
  id: string; // Convex IDは文字列
  user_id: string;
  card_id: string;
  is_locked?: boolean;
  quantity: number;
};
