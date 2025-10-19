import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ユーザーテーブル
  user: defineTable({
    clerk_id: v.string(),
    email: v.string(),
  }),

  // プロフィールテーブル
  profiles: defineTable({
    user_id: v.id("user"),
    name: v.string(),
    icon: v.string(),
    gem: v.int64(),
  }).index("by_user_id", ["user_id"]),

  // カードテーブル
  card: defineTable({
    card_number: v.string(),
    text: v.string(),
    rarity: v.union(
      v.literal("common"),
      v.literal("rare"),
      v.literal("super_rare"),
      v.literal("epic"),
      v.literal("legendary")
    ),
  })
    .index("by_rarity", ["rarity"])
    .index("by_card_number", ["card_number"])
    .index("by_rarity_and_number", ["rarity", "card_number"]),

  // ユーザのカードテーブル
  user_card: defineTable({
    user_id: v.id("user"),
    card_id: v.id("card"),
    quantity: v.int64(),
    acquired_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_user_and_card", ["user_id", "card_id"]),

  // デッキテーブル
  deck: defineTable({
    user_id: v.id("user"),
    deck_name: v.string(),
  }).index("by_user_id", ["user_id"]),

  // デッキのカードテーブル
  deck_card: defineTable({
    deck_id: v.id("deck"),
    card_id: v.id("card"),
    position: v.int64(),
  })
    .index("by_deck_id", ["deck_id"])
    .index("by_deck_and_card", ["deck_id", "card_id"]),

  // マーケットテーブル
  market: defineTable({
    user_id: v.id("user"), // 出品者
    card_id: v.id("card"),
    price: v.float64(),
    status: v.union(v.literal("listed"), v.literal("sold"), v.literal("canceled")),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_card_id", ["card_id"]),

  // 販売記録テーブル
  sale_record: defineTable({
    buyer_id: v.id("user"),
    seller_id: v.id("user"),
    market_id: v.id("market"),
    price: v.float64(),
    created_at: v.number(),
  })
    .index("by_buyer_id", ["buyer_id"])
    .index("by_seller_id", ["seller_id"])
    .index("by_market_id", ["market_id"]),
});
