import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const rarityUnion = v.union(
  v.literal("common"),
  v.literal("rare"),
  v.literal("super_rare"),
  v.literal("epic"),
  v.literal("legendary")
);

// プレイヤーの提出カード情報
const submittedCard = v.object({
  card_id: v.id("card"),
  submission_type: v.union(v.literal("normal"), v.literal("victory_declaration")),
  similarity_score: v.float64(),
  rarity_bonus: v.float64(),
  final_score: v.float64(),
  is_deck_card: v.boolean(),
});

// ターン状態
const turnState = v.object({
  actions_remaining: v.int64(),
  actions_log: v.array(v.any()), // ActionLog の配列
  deck_cards_remaining: v.int64(),
});

// プレイヤーの状態
const playerState = v.object({
  user_id: v.id("user"),
  score: v.int64(), // 現在のポイント (3点で勝利)
  hand: v.array(v.id("card")), // 手札 (5枚)
  deck_ref: v.id("deck"), // 使用デッキの参照
  turn_state: turnState,
  submitted_card: v.optional(submittedCard),
  is_ready: v.boolean(),
  is_connected: v.boolean(),
  last_action_time: v.number(),
});

// プレイヤーの応答
const playerResponse = v.object({
  user_id: v.id("user"),
  response_type: v.union(v.literal("call"), v.literal("fold")),
  timestamp: v.number(),
});

// ラウンド提出情報
const roundSubmission = v.object({
  user_id: v.id("user"),
  card_id: v.id("card"),
  card_text: v.string(),
  submission_type: v.union(v.literal("normal"), v.literal("victory_declaration")),
  similarity_score: v.float64(),
  rarity_bonus: v.float64(),
  final_score: v.float64(),
  response_type: v.optional(v.union(v.literal("call"), v.literal("fold"))),
});

// ポイント付与情報
const pointsAwarded = v.object({
  user_id: v.id("user"),
  points: v.int64(),
  reason: v.union(
    v.literal("normal_win"),
    v.literal("normal_lose"),
    v.literal("victory_declaration_success"),
    v.literal("victory_declaration_fail"),
    v.literal("fold_against_declaration"),
    v.literal("opponent_fold"),
    v.literal("draw")
  ),
});

// ラウンド結果
const roundResult = v.object({
  round_number: v.int64(),
  field_card_id: v.id("card"),
  field_card_text: v.string(),
  submissions: v.array(roundSubmission),
  winner_id: v.optional(v.id("user")),
  points_awarded: v.array(pointsAwarded),
  timestamp: v.number(),
});

// バトルフェーズ
const gamePhaseUnion = v.union(
  v.literal("field_card_presentation"), // 場札提示フェーズ
  v.literal("player_action"), // プレイヤーアクションフェーズ (交換/生成)
  v.literal("word_submission"), // 単語提出フェーズ
  v.literal("response"), // 対応フェーズ
  v.literal("point_calculation") // ポイント計算フェーズ
);

export default defineSchema({
  // ユーザーテーブル
  user: defineTable({
    clerk_id: v.string(),
    email: v.string(),
  }).index("by_clerk_id", ["clerk_id"]),

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
    price: v.int64(),
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
    price: v.int64(),
    created_at: v.number(),
  })
    .index("by_buyer_id", ["buyer_id"])
    .index("by_seller_id", ["seller_id"])
    .index("by_market_id", ["market_id"]),

  // 対戦テーブル
  battle: defineTable({
    player_ids: v.array(v.id("user")), // 参加者リスト
    game_status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished")), // ゲームの進行状況
    winner_ids: v.optional(v.array(v.id("user"))), // 勝者IDの配列
    current_round: v.int64(), // 現在のラウンド数
    current_phase: gamePhaseUnion, // 現在のフェーズ
    field_card_id: v.id("card"), // お題カード
    players: v.array(playerState), // プレイヤーの状態配列
    phase_start_time: v.number(), // フェーズ開始時刻
    responses: v.optional(v.array(playerResponse)), // 勝利宣言への応答
    round_results: v.array(roundResult), // ラウンド結果の履歴
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_player_id", ["player_ids"])
    .index("by_status", ["game_status"]),

  // ルーム対戦用テーブル
  game_room: defineTable({
    players: v.array(v.id("user")), // 参加者リスト
    room_code: v.string(), // 招待コード
    host_id: v.id("user"), // ルーム作成者
    is_active: v.boolean(), // 待機中か対戦中か
    battle_id: v.optional(v.id("battle")),
    player_decks: v.optional(v.any()), // プレイヤーのデッキ選択 Record<userId, deckId>
  })
    .index("by_code", ["room_code"])
    .index("by_host", ["host_id"]),
});
