import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const rarityUnion = v.union(
  v.literal("common"),
  v.literal("rare"),
  v.literal("super_rare"),
  v.literal("epic"),
  v.literal("legendary")
);

const playerState = v.object({
  user_id: v.id("user"),
  score: v.int64(), // 現在のポイント (3点で勝利)
  // リアルタイム手札状態 (5枚)
  hand: v.array(v.id("card_master")),
  // 使用デッキの参照
  deck_ref: v.id("deck"),
  // ターン内アクションログ (複雑なJSON構造を v.any() で許容)
  turn_state: v.any(),
  // 提出カード
  submitted_id: v.optional(v.id("card_master")),
});

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
    rarity: rarityUnion,
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
    .index("by_card_id", ["card_id"])
    .index("by_status", ["status"]),

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

  // 対戦テーブル
  battle: defineTable({
    // 参加プレイヤーIDの配列
    player_ids: v.array(v.id("user")),
    game_status: v.string(), // "active", "finished"
    // 勝者IDの配列（同点勝利を考慮）
    winner_ids: v.optional(v.array(v.id("user"))),

    current_round: v.int64(),

    // ラウンド情報
    field_card_id: v.id("card"),
    field_card_text: v.string(),

    // 各プレイヤーの状態を格納する配列 (2~5人に対応)
    players: v.array(playerState),

    // ポイント計算結果
    submission_data: v.optional(v.array(v.object({ userId: v.id("user"), score: v.int64() }))), // { userId1: score, userId2: score, ... }

    last_action_time: v.number(), // タイムアウト判定用
  })
    // 参加プレイヤーの検索用インデックス
    .index("by_player_id", ["player_ids"])
    .index("by_status", ["game_status"]),

  // ルーム対戦用テーブル
  game_room: defineTable({
    players: v.array(v.id("user")), // 参加者リスト
    room_code: v.string(), // 招待コード
    host_id: v.id("user"), // ルーム作成者
    is_active: v.boolean(), // 待機中か対戦中か
    battle_id: v.optional(v.id("battle")),
  })
    .index("by_code", ["room_code"])
    .index("by_host", ["host_id"]),
});
