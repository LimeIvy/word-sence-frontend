import { Id } from "../../../convex/_generated/dataModel";

export type MarketStatus = "listed" | "sold" | "canceled";

export interface MarketListing {
  _id: Id<"market">;
  _creationTime: number;
  user_id: Id<"user">;
  card_id: Id<"card">;
  price: bigint;
  status: MarketStatus;
  created_at: number;
  updated_at: number;
}

export interface Card {
  _id: Id<"card">;
  _creationTime: number;
  card_number: string;
  text: string;
  rarity: "common" | "rare" | "super_rare" | "epic" | "legendary";
}

export interface User {
  _id: Id<"user">;
  _creationTime: number;
  clerk_id: string;
  email: string;
}

export interface Profile {
  _id: Id<"profiles">;
  _creationTime: number;
  user_id: Id<"user">;
  name: string;
  icon: string;
  gem: bigint;
}

export interface MarketListingWithDetails extends MarketListing {
  card: Card;
  seller: (User & { profile: Profile | null }) | null;
}

export interface MyListing extends MarketListing {
  card: Card | null;
}

export interface Purchase {
  _id: Id<"sale_record">;
  _creationTime: number;
  buyer_id: Id<"user">;
  seller_id: Id<"user">;
  market_id: Id<"market">;
  price: bigint;
  created_at: number;
  card: Card | null;
  seller: User | null;
}

export interface Sale {
  _id: Id<"sale_record">;
  _creationTime: number;
  buyer_id: Id<"user">;
  seller_id: Id<"user">;
  market_id: Id<"market">;
  price: bigint;
  created_at: number;
  card: Card | null;
  buyer: User | null;
}
