import axios from "axios";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

const submissionTypeValidator = v.union(v.literal("normal"), v.literal("victory_declaration"));
const responseTypeValidator = v.union(v.literal("call"), v.literal("fold"));
const drawSourceValidator = v.union(v.literal("deck"), v.literal("pool"));

/**
 * デッキのカードをシャッフルして取得
 */
async function getDeckCards(
  ctx: QueryCtx | MutationCtx,
  deckId: Id<"deck">
): Promise<Id<"card">[]> {
  const deckCards = await ctx.db
    .query("deck_card")
    .withIndex("by_deck_id", (q) => q.eq("deck_id", deckId))
    .collect();

  const cardIds = deckCards.map((dc) => dc.card_id);

  // カードをシャッフル
  for (let i = cardIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardIds[i], cardIds[j]] = [cardIds[j], cardIds[i]];
  }

  return cardIds;
}

/**
 * ランダムなカードを1枚取得
 */
async function getRandomFieldCard(ctx: MutationCtx): Promise<Id<"card">> {
  const allCards = await ctx.db.query("card").collect();
  const randomIndex = Math.floor(Math.random() * allCards.length);
  return allCards[randomIndex]._id;
}

/**
 * カード情報を取得
 */
async function getCardOrThrow(
  ctx: QueryCtx | MutationCtx,
  cardId: Id<"card">
): Promise<Doc<"card">> {
  const card = await ctx.db.get(cardId);
  if (!card) {
    throw new Error(`Card not found: ${cardId}`);
  }
  return card;
}

/**
 * プレイヤーが勝利条件を満たしているか判定
 */
function hasPlayerWon(score: bigint): boolean {
  return score >= 3n;
}

/**
 * 類似度スコアを計算
 * Word2Vecモデルを使用して2つの単語間の類似度を計算
 */
async function calculateSimilarityScore(
  fieldCardText: string,
  submittedCardText: string
): Promise<number> {
  const API_BASE_URL = process.env.WORD_SENCE_API_URL;
  if (!API_BASE_URL) {
    throw new Error("WORD_SENCE_API_URL is not set");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/similarity`, {
      word1: fieldCardText,
      word2: submittedCardText,
    });

    // Word2Vecの類似度は-1〜1の範囲なので、0〜1に正規化
    const normalizedScore = (response.data.result + 1) / 2;
    return Math.max(0, Math.min(1, normalizedScore));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Similarity API error: ${error.response?.status}`, error.message);
    } else {
      console.error("Failed to calculate similarity:", error);
    }
    // エラー時はフォールバック（中程度のスコア）
    return 0.5;
  }
}

/**
 * レアリティボーナスを計算
 */
function getRarityBonus(rarity: string): number {
  switch (rarity) {
    case "common":
      return 0.0;
    case "rare":
      return 0.02;
    case "super_rare":
      return 0.04;
    case "epic":
      return 0.06;
    case "legendary":
      return 0.08;
    default:
      return 0.0;
  }
}

/**
 * 最終スコアを計算
 */
function calculateFinalScore(similarityScore: number, rarityBonus: number): number {
  return Math.min(similarityScore + rarityBonus, 1.0);
}

/**
 * ラウンドの勝者を判定
 */
function determineWinner(
  submissions: Array<{ user_id: Id<"user">; final_score: number }>
): Id<"user"> | undefined {
  if (submissions.length === 0) return undefined;

  const maxScore = Math.max(...submissions.map((s) => s.final_score));
  const winners = submissions.filter((s) => s.final_score === maxScore);

  // 同点の場合はundefined
  if (winners.length > 1) return undefined;

  return winners[0].user_id;
}

type PointAwardReason =
  | "normal_win"
  | "normal_lose"
  | "victory_declaration_success"
  | "victory_declaration_fail"
  | "fold_against_declaration"
  | "opponent_fold"
  | "draw";

/**
 * ポイントを計算（2人対戦用）
 */
function calculatePoints(
  player1: {
    user_id: Id<"user">;
    submitted_card: NonNullable<Doc<"battle">["players"][number]["submitted_card"]>;
    response?: "call" | "fold";
  },
  player2: {
    user_id: Id<"user">;
    submitted_card: NonNullable<Doc<"battle">["players"][number]["submitted_card"]>;
    response?: "call" | "fold";
  }
): Array<{ user_id: Id<"user">; points: bigint; reason: PointAwardReason }> {
  const p1Declaration = player1.submitted_card.submission_type === "victory_declaration";
  const p2Declaration = player2.submitted_card.submission_type === "victory_declaration";

  // ケース1: 両者とも通常提出
  if (!p1Declaration && !p2Declaration) {
    const score1 = player1.submitted_card.final_score;
    const score2 = player2.submitted_card.final_score;

    if (score1 > score2) {
      return [
        { user_id: player1.user_id, points: 1n, reason: "normal_win" },
        { user_id: player2.user_id, points: -1n, reason: "normal_lose" },
      ];
    }
    if (score2 > score1) {
      return [
        { user_id: player1.user_id, points: -1n, reason: "normal_lose" },
        { user_id: player2.user_id, points: 1n, reason: "normal_win" },
      ];
    }
    // 引き分け
    return [
      { user_id: player1.user_id, points: 0n, reason: "draw" },
      { user_id: player2.user_id, points: 0n, reason: "draw" },
    ];
  }

  // ケース2: P1が勝利宣言
  if (p1Declaration && !p2Declaration) {
    return calculateVictoryDeclarationPoints(player1, player2);
  }

  // ケース3: P2が勝利宣言
  if (!p1Declaration && p2Declaration) {
    return calculateVictoryDeclarationPoints(player2, player1);
  }

  // ケース4: 両者とも勝利宣言
  if (p1Declaration && p2Declaration) {
    const score1 = player1.submitted_card.final_score;
    const score2 = player2.submitted_card.final_score;

    if (score1 > score2) {
      return [
        { user_id: player1.user_id, points: 2n, reason: "victory_declaration_success" },
        { user_id: player2.user_id, points: -2n, reason: "victory_declaration_fail" },
      ];
    }
    if (score2 > score1) {
      return [
        { user_id: player1.user_id, points: -2n, reason: "victory_declaration_fail" },
        { user_id: player2.user_id, points: 2n, reason: "victory_declaration_success" },
      ];
    }
    return [
      { user_id: player1.user_id, points: 0n, reason: "draw" },
      { user_id: player2.user_id, points: 0n, reason: "draw" },
    ];
  }

  return [];
}

/**
 * 勝利宣言のポイント計算
 */
function calculateVictoryDeclarationPoints(
  declarer: {
    user_id: Id<"user">;
    submitted_card: NonNullable<Doc<"battle">["players"][number]["submitted_card"]>;
    response?: "call" | "fold";
  },
  opponent: {
    user_id: Id<"user">;
    submitted_card: NonNullable<Doc<"battle">["players"][number]["submitted_card"]>;
    response?: "call" | "fold";
  }
): Array<{ user_id: Id<"user">; points: bigint; reason: PointAwardReason }> {
  // 相手がフォールド
  if (opponent.response === "fold") {
    return [
      { user_id: declarer.user_id, points: 1n, reason: "opponent_fold" },
      { user_id: opponent.user_id, points: 0n, reason: "fold_against_declaration" },
    ];
  }

  // 相手がコール（または応答なし = コール扱い）
  const declarerScore = declarer.submitted_card.final_score;
  const opponentScore = opponent.submitted_card.final_score;

  if (declarerScore > opponentScore) {
    return [
      { user_id: declarer.user_id, points: 2n, reason: "victory_declaration_success" },
      { user_id: opponent.user_id, points: -2n, reason: "victory_declaration_fail" },
    ];
  }
  if (opponentScore > declarerScore) {
    return [
      { user_id: declarer.user_id, points: -2n, reason: "victory_declaration_fail" },
      { user_id: opponent.user_id, points: 2n, reason: "victory_declaration_success" },
    ];
  }
  // 引き分け
  return [
    { user_id: declarer.user_id, points: 0n, reason: "draw" },
    { user_id: opponent.user_id, points: 0n, reason: "draw" },
  ];
}

/**
 * フェーズがタイムアウトしたか判定
 */
function isPhaseTimedOut(
  phaseStartTime: number,
  currentPhase: Doc<"battle">["current_phase"]
): boolean {
  const PHASE_TIME_LIMITS = {
    field_card_presentation: 5,
    player_action: 60,
    word_submission: 30,
    response: 20,
    point_calculation: 10,
  };

  const now = Date.now();
  const elapsed = Math.floor((now - phaseStartTime) / 1000);
  return elapsed >= PHASE_TIME_LIMITS[currentPhase];
}

// ====================
// クエリ関数
// ====================

/**
 * バトル情報を取得
 */
export const getBattle = query({
  args: { battleId: v.id("battle") },
  handler: async (ctx, { battleId }) => {
    const battle = await ctx.db.get(battleId);
    if (!battle) {
      throw new Error("Battle not found");
    }
    return battle;
  },
});

/**
 * ユーザーの参加中バトルを取得
 */
export const getUserBattles = query({
  args: { userId: v.id("user") },
  handler: async (ctx, { userId }) => {
    const battles = await ctx.db
      .query("battle")
      .filter((q) => q.eq(q.field("game_status"), "active"))
      .collect();

    return battles.filter((battle) => battle.player_ids.includes(userId));
  },
});

// ====================
// ミューテーション関数
// ====================

/**
 * バトルを作成
 */
export const createBattle = mutation({
  args: {
    player_ids: v.array(v.id("user")),
    deck_ids: v.array(v.id("deck")),
  },
  handler: async (ctx, { player_ids, deck_ids }) => {
    // 入力検証
    if (player_ids.length !== deck_ids.length) {
      throw new Error("Player IDs and Deck IDs must have the same length");
    }
    if (player_ids.length < 2 || player_ids.length > 5) {
      throw new Error("Battle requires 2-5 players");
    }

    // お題カードをランダムに選択
    const fieldCardId = await getRandomFieldCard(ctx);

    // 各プレイヤーの初期状態を作成
    const players = await Promise.all(
      player_ids.map(async (userId, index) => {
        const deckId = deck_ids[index];
        const deckCards = await getDeckCards(ctx, deckId);

        // 手札を5枚配る
        const hand = deckCards.slice(0, 5);
        const remainingDeck = deckCards.slice(5);

        return {
          user_id: userId,
          score: 0n,
          hand,
          deck_ref: deckId,
          turn_state: {
            actions_remaining: 3n,
            actions_log: [],
            deck_cards_remaining: BigInt(remainingDeck.length),
          },
          submitted_card: undefined,
          is_ready: false,
          is_connected: true,
          last_action_time: Date.now(),
        };
      })
    );

    // バトルを作成
    const now = Date.now();
    const battleId = await ctx.db.insert("battle", {
      player_ids,
      game_status: "active",
      winner_ids: undefined,
      current_round: 1n,
      current_phase: "field_card_presentation",
      field_card_id: fieldCardId,
      players,
      phase_start_time: now,
      responses: undefined,
      round_results: [],
      created_at: now,
      updated_at: now,
    });

    return { battleId };
  },
});

/**
 * カード提出
 */
export const submitCard = mutation({
  args: {
    battle_id: v.id("battle"),
    user_id: v.id("user"),
    card_id: v.id("card"),
    submission_type: submissionTypeValidator,
  },
  handler: async (ctx, { battle_id, user_id, card_id, submission_type }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "word_submission") {
      throw new Error("Not in submission phase");
    }

    // プレイヤーを検索
    const playerIndex = battle.players.findIndex((p) => p.user_id === user_id);
    if (playerIndex === -1) {
      throw new Error("Player not found in battle");
    }

    const player = battle.players[playerIndex];

    // 既に提出済みかチェック
    if (player.submitted_card) {
      throw new Error("Card already submitted");
    }

    // 手札にカードがあるかチェック
    if (!player.hand.includes(card_id)) {
      throw new Error("Card not in hand");
    }

    // カード情報を取得
    const submittedCard = await getCardOrThrow(ctx, card_id);
    const fieldCard = await getCardOrThrow(ctx, battle.field_card_id);

    // デッキカードかどうか判定
    const deckCards = await getDeckCards(ctx, player.deck_ref);
    const isDeckCard = deckCards.includes(card_id);

    // スコア計算
    const similarityScore = await calculateSimilarityScore(fieldCard.text, submittedCard.text);
    const rarityBonus = isDeckCard ? getRarityBonus(submittedCard.rarity) : 0;
    const finalScore = calculateFinalScore(similarityScore, rarityBonus);

    // プレイヤー状態を更新
    const updatedPlayers = [...battle.players];
    updatedPlayers[playerIndex] = {
      ...player,
      submitted_card: {
        card_id,
        submission_type,
        similarity_score: similarityScore,
        rarity_bonus: rarityBonus,
        final_score: finalScore,
        is_deck_card: isDeckCard,
      },
      last_action_time: Date.now(),
    };

    await ctx.db.patch(battle_id, {
      players: updatedPlayers,
      updated_at: Date.now(),
    });

    // 全員が提出したかチェック
    const allSubmitted = updatedPlayers.every((p) => p.submitted_card !== undefined);
    if (allSubmitted) {
      // 勝利宣言があるかチェック
      const hasDeclaration = updatedPlayers.some(
        (p) => p.submitted_card?.submission_type === "victory_declaration"
      );

      if (hasDeclaration) {
        // 対応フェーズへ移行
        await ctx.db.patch(battle_id, {
          current_phase: "response",
          phase_start_time: Date.now(),
          responses: [],
          updated_at: Date.now(),
        });
      } else {
        // 判定フェーズへ移行
        await transitionToPointCalculation(ctx, battle_id);
      }
    }

    return { success: true, finalScore };
  },
});

/**
 * 勝利宣言への応答
 */
export const respondToDeclaration = mutation({
  args: {
    battle_id: v.id("battle"),
    user_id: v.id("user"),
    response_type: responseTypeValidator,
  },
  handler: async (ctx, { battle_id, user_id, response_type }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "response") {
      throw new Error("Not in response phase");
    }

    // 既に応答済みかチェック
    const existingResponse = battle.responses?.find((r) => r.user_id === user_id);
    if (existingResponse) {
      throw new Error("Already responded");
    }

    // 応答を追加
    const responses = battle.responses || [];
    responses.push({
      user_id,
      response_type,
      timestamp: Date.now(),
    });

    await ctx.db.patch(battle_id, {
      responses,
      updated_at: Date.now(),
    });

    // 全員が応答したかチェック（勝利宣言者を除く）
    const declarerId = battle.players.find(
      (p) => p.submitted_card?.submission_type === "victory_declaration"
    )?.user_id;

    const nonDeclarers = battle.players.filter((p) => p.user_id !== declarerId);
    const allResponded = nonDeclarers.every((p) => responses.some((r) => r.user_id === p.user_id));

    if (allResponded) {
      await transitionToPointCalculation(ctx, battle_id);
    }

    return { success: true };
  },
});

/**
 * プレイヤー準備完了
 */
export const setPlayerReady = mutation({
  args: {
    battle_id: v.id("battle"),
    user_id: v.id("user"),
  },
  handler: async (ctx, { battle_id, user_id }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "player_action") {
      throw new Error("Not in player action phase");
    }

    // プレイヤーを検索
    const playerIndex = battle.players.findIndex((p) => p.user_id === user_id);
    if (playerIndex === -1) {
      throw new Error("Player not found in battle");
    }

    // プレイヤー状態を更新
    const updatedPlayers = [...battle.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      is_ready: true,
      last_action_time: Date.now(),
    };

    await ctx.db.patch(battle_id, {
      players: updatedPlayers,
      updated_at: Date.now(),
    });

    // 全員が準備完了したかチェック
    const allReady = updatedPlayers.every((p) => p.is_ready);
    if (allReady) {
      // 提出フェーズへ移行
      await ctx.db.patch(battle_id, {
        current_phase: "word_submission",
        phase_start_time: Date.now(),
        updated_at: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * カード交換
 */
export const exchangeCards = mutation({
  args: {
    battle_id: v.id("battle"),
    user_id: v.id("user"),
    discard_card_ids: v.array(v.id("card")),
    draw_source: drawSourceValidator,
  },
  handler: async (ctx, { battle_id, user_id, discard_card_ids, draw_source }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "player_action") {
      throw new Error("Not in player action phase");
    }

    // プレイヤーを検索
    const playerIndex = battle.players.findIndex((p) => p.user_id === user_id);
    if (playerIndex === -1) {
      throw new Error("Player not found in battle");
    }

    const player = battle.players[playerIndex];

    // 行動回数チェック
    if (player.turn_state.actions_remaining <= 0n) {
      throw new Error("No actions remaining");
    }

    // 破棄枚数チェック
    if (discard_card_ids.length === 0 || discard_card_ids.length > 5) {
      throw new Error("Invalid number of cards to discard");
    }

    // 手札にあるカードかチェック
    const allInHand = discard_card_ids.every((cardId) => player.hand.includes(cardId));
    if (!allInHand) {
      throw new Error("Some cards are not in hand");
    }

    // カードをドロー
    let drawnCards: Id<"card">[] = [];

    if (draw_source === "deck") {
      // デッキからドロー
      if (player.turn_state.deck_cards_remaining < BigInt(discard_card_ids.length)) {
        throw new Error("Not enough cards in deck");
      }

      const deckCards = await getDeckCards(ctx, player.deck_ref);
      const usedCards = new Set([...player.hand]);
      const availableCards = deckCards.filter((cardId) => !usedCards.has(cardId));

      drawnCards = availableCards.slice(0, discard_card_ids.length);
    } else {
      // プールからランダムドロー
      const allCards = await ctx.db.query("card").collect();
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      drawnCards = shuffled.slice(0, discard_card_ids.length).map((c) => c._id);
    }

    // 手札を更新
    const newHand = player.hand.filter((cardId) => !discard_card_ids.includes(cardId));
    newHand.push(...drawnCards);

    // プレイヤー状態を更新
    const updatedPlayers = [...battle.players];
    updatedPlayers[playerIndex] = {
      ...player,
      hand: newHand,
      turn_state: {
        ...player.turn_state,
        actions_remaining: player.turn_state.actions_remaining - 1n,
        deck_cards_remaining:
          draw_source === "deck"
            ? player.turn_state.deck_cards_remaining - BigInt(discard_card_ids.length)
            : player.turn_state.deck_cards_remaining,
        actions_log: [
          ...player.turn_state.actions_log,
          {
            action_type: "card_exchange",
            timestamp: Date.now(),
            details: {
              discarded_count: discard_card_ids.length,
              draw_source,
              drawn_cards: drawnCards,
            },
          },
        ],
      },
      last_action_time: Date.now(),
    };

    await ctx.db.patch(battle_id, {
      players: updatedPlayers,
      updated_at: Date.now(),
    });

    return { success: true, drawnCards };
  },
});

/**
 * 単語生成
 * Word2Vecモデルを使用してベクトル演算により新しい単語を生成
 */
export const generateWord = mutation({
  args: {
    battle_id: v.id("battle"),
    user_id: v.id("user"),
    positive_cards: v.array(v.id("card")),
    negative_cards: v.array(v.id("card")),
  },
  handler: async (ctx, { battle_id, user_id, positive_cards, negative_cards }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "player_action") {
      throw new Error("Not in player action phase");
    }

    // プレイヤーを検索
    const playerIndex = battle.players.findIndex((p) => p.user_id === user_id);
    if (playerIndex === -1) {
      throw new Error("Player not found in battle");
    }

    const player = battle.players[playerIndex];

    // 行動回数チェック
    if (player.turn_state.actions_remaining <= 0n) {
      throw new Error("No actions remaining");
    }

    // カード枚数チェック
    const totalCards = positive_cards.length + negative_cards.length;
    if (totalCards < 2 || totalCards > 5) {
      throw new Error("Total cards must be between 2 and 5");
    }

    // 全てのカードが手札にあるかチェック
    const allCards = [...positive_cards, ...negative_cards];
    const allInHand = allCards.every((cardId) => player.hand.includes(cardId));
    if (!allInHand) {
      throw new Error("Some cards are not in hand");
    }

    // カード情報を取得
    const positiveTexts = await Promise.all(
      positive_cards.map(async (cardId) => {
        const card = await getCardOrThrow(ctx, cardId);
        return card.text;
      })
    );

    const negativeTexts = await Promise.all(
      negative_cards.map(async (cardId) => {
        const card = await getCardOrThrow(ctx, cardId);
        return card.text;
      })
    );

    // Word2Vec APIを使用して新しい単語を生成
    let generatedWord: string;
    try {
      const API_BASE_URL = process.env.WORD_SENCE_API_URL;
      if (!API_BASE_URL) {
        throw new Error("WORD_SENCE_API_URL is not set");
      }

      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        positive: positiveTexts,
        negative: negativeTexts,
      });

      // APIは [["単語", スコア]] の形式で返す
      generatedWord = response.data.result[0][0];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Word generation API error: ${error.response?.status}`, error.message);
      } else {
        console.error("Failed to generate word:", error);
      }
      throw new Error("Word generation failed. Please try again.");
    }

    // 生成された単語に対応するカードを検索
    const generatedCard = await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("text"), generatedWord))
      .first();

    if (!generatedCard) {
      // カードが見つからない場合はランダムなカードを返す（フォールバック）
      const allCardsInDb = await ctx.db.query("card").collect();
      const randomIndex = Math.floor(Math.random() * allCardsInDb.length);
      const fallbackCard = allCardsInDb[randomIndex];

      console.warn(`Generated word "${generatedWord}" not found in card database. Using fallback.`);

      // 使用したカードを手札から削除し、フォールバックカードを追加
      const newHand = player.hand.filter((cardId) => !allCards.includes(cardId));
      newHand.push(fallbackCard._id);

      // プレイヤー状態を更新
      const updatedPlayers = [...battle.players];
      updatedPlayers[playerIndex] = {
        ...player,
        hand: newHand,
        turn_state: {
          ...player.turn_state,
          actions_remaining: player.turn_state.actions_remaining - 1n,
          actions_log: [
            ...player.turn_state.actions_log,
            {
              action_type: "word_generation",
              timestamp: Date.now(),
              details: {
                source_cards: allCards,
                generated_card: fallbackCard._id,
                positive_zone: positive_cards,
                negative_zone: negative_cards,
              },
            },
          ],
        },
        last_action_time: Date.now(),
      };

      await ctx.db.patch(battle_id, {
        players: updatedPlayers,
        updated_at: Date.now(),
      });

      return {
        success: true,
        generatedCard: fallbackCard._id,
        generatedCardText: fallbackCard.text,
        warning: "Generated word not found in database. Random card selected.",
      };
    }

    // 使用したカードを手札から削除し、生成されたカードを追加
    const newHand = player.hand.filter((cardId) => !allCards.includes(cardId));
    newHand.push(generatedCard._id);

    // プレイヤー状態を更新
    const updatedPlayers = [...battle.players];
    updatedPlayers[playerIndex] = {
      ...player,
      hand: newHand,
      turn_state: {
        ...player.turn_state,
        actions_remaining: player.turn_state.actions_remaining - 1n,
        actions_log: [
          ...player.turn_state.actions_log,
          {
            action_type: "word_generation",
            timestamp: Date.now(),
            details: {
              source_cards: allCards,
              generated_card: generatedCard._id,
              positive_zone: positive_cards,
              negative_zone: negative_cards,
            },
          },
        ],
      },
      last_action_time: Date.now(),
    };

    await ctx.db.patch(battle_id, {
      players: updatedPlayers,
      updated_at: Date.now(),
    });

    return {
      success: true,
      generatedCard: generatedCard._id,
      generatedCardText: generatedCard.text,
    };
  },
});

/**
 * ポイント計算フェーズに移行
 */
async function transitionToPointCalculation(ctx: MutationCtx, battleId: Id<"battle">) {
  const battle = await ctx.db.get(battleId);
  if (!battle) return;

  // 2人対戦の場合のポイント計算
  if (battle.players.length === 2) {
    const [player1, player2] = battle.players;

    if (!player1.submitted_card || !player2.submitted_card) {
      throw new Error("Not all players have submitted cards");
    }

    // 応答を取得
    const player1Response = battle.responses?.find(
      (r) => r.user_id === player1.user_id
    )?.response_type;
    const player2Response = battle.responses?.find(
      (r) => r.user_id === player2.user_id
    )?.response_type;

    // ポイント計算
    const points = calculatePoints(
      {
        user_id: player1.user_id,
        submitted_card: player1.submitted_card,
        response: player1Response,
      },
      {
        user_id: player2.user_id,
        submitted_card: player2.submitted_card,
        response: player2Response,
      }
    );

    // スコアを更新
    const updatedPlayers = battle.players.map((player) => {
      const pointsAwarded = points.find((p) => p.user_id === player.user_id);
      if (pointsAwarded) {
        return {
          ...player,
          score: player.score + pointsAwarded.points,
        };
      }
      return player;
    });

    // ラウンド結果を記録
    const fieldCard = await getCardOrThrow(ctx, battle.field_card_id);
    const submissions = await Promise.all(
      battle.players.map(async (player) => {
        if (!player.submitted_card) throw new Error("Missing submitted card");
        const card = await getCardOrThrow(ctx, player.submitted_card.card_id);
        const response = battle.responses?.find((r) => r.user_id === player.user_id);
        return {
          user_id: player.user_id,
          card_id: player.submitted_card.card_id,
          card_text: card.text,
          submission_type: player.submitted_card.submission_type,
          similarity_score: player.submitted_card.similarity_score,
          rarity_bonus: player.submitted_card.rarity_bonus,
          final_score: player.submitted_card.final_score,
          response_type: response?.response_type,
        };
      })
    );

    const roundResult = {
      round_number: battle.current_round,
      field_card_id: battle.field_card_id,
      field_card_text: fieldCard.text,
      submissions,
      winner_id: determineWinner(
        battle.players.map((p) => ({
          user_id: p.user_id,
          final_score: p.submitted_card!.final_score,
        }))
      ),
      points_awarded: points.map((p) => ({
        user_id: p.user_id,
        points: p.points,
        reason: p.reason,
      })),
      timestamp: Date.now(),
    };

    // 勝者判定
    const winners = updatedPlayers.filter((p) => hasPlayerWon(p.score));

    if (winners.length > 0) {
      // ゲーム終了
      await ctx.db.patch(battleId, {
        players: updatedPlayers,
        current_phase: "point_calculation",
        phase_start_time: Date.now(),
        round_results: [...battle.round_results, roundResult],
        game_status: "finished",
        winner_ids: winners.map((w) => w.user_id),
        updated_at: Date.now(),
      });
    } else {
      // 次のラウンドへ
      await ctx.db.patch(battleId, {
        players: updatedPlayers,
        current_phase: "point_calculation",
        phase_start_time: Date.now(),
        round_results: [...battle.round_results, roundResult],
        updated_at: Date.now(),
      });
    }
  }
}

/**
 * 次のラウンドを開始
 */
export const startNextRound = mutation({
  args: { battle_id: v.id("battle") },
  handler: async (ctx, { battle_id }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    // フェーズチェック
    if (battle.current_phase !== "point_calculation") {
      throw new Error("Not in point calculation phase");
    }

    // ゲーム終了チェック
    if (battle.game_status === "finished") {
      throw new Error("Battle already finished");
    }

    // 新しいお題カードを選択
    const newFieldCard = await getRandomFieldCard(ctx);

    // プレイヤー状態をリセット
    const resetPlayers = battle.players.map((player) => ({
      ...player,
      turn_state: {
        actions_remaining: 3n,
        actions_log: [],
        deck_cards_remaining: player.turn_state.deck_cards_remaining,
      },
      submitted_card: undefined,
      is_ready: false,
      last_action_time: Date.now(),
    }));

    // 次のラウンドへ
    await ctx.db.patch(battle_id, {
      current_round: battle.current_round + 1n,
      current_phase: "field_card_presentation",
      field_card_id: newFieldCard,
      players: resetPlayers,
      phase_start_time: Date.now(),
      responses: undefined,
      updated_at: Date.now(),
    });

    return { success: true };
  },
});

/**
 * フェーズタイムアウトチェック（定期実行用）
 */
export const checkPhaseTimeout = mutation({
  args: { battle_id: v.id("battle") },
  handler: async (ctx, { battle_id }) => {
    const battle = await ctx.db.get(battle_id);
    if (!battle) {
      throw new Error("Battle not found");
    }

    if (battle.game_status !== "active") {
      return { timedOut: false };
    }

    // タイムアウトチェック
    if (!isPhaseTimedOut(battle.phase_start_time, battle.current_phase)) {
      return { timedOut: false };
    }

    // タイムアウト処理
    switch (battle.current_phase) {
      case "field_card_presentation":
        // 自動的に次のフェーズへ
        await ctx.db.patch(battle_id, {
          current_phase: "player_action",
          phase_start_time: Date.now(),
          updated_at: Date.now(),
        });
        break;

      case "player_action":
        // 未準備のプレイヤーを強制的に準備完了
        const updatedPlayers = battle.players.map((p) => ({ ...p, is_ready: true }));
        await ctx.db.patch(battle_id, {
          players: updatedPlayers,
          current_phase: "word_submission",
          phase_start_time: Date.now(),
          updated_at: Date.now(),
        });
        break;

      case "word_submission": {
        // 未提出のプレイヤーはランダムなカードを提出
        const updatedPlayersSubmission = await Promise.all(
          battle.players.map(async (player) => {
            if (player.submitted_card) return player;

            // ランダムにカードを選択
            const randomCard = player.hand[Math.floor(Math.random() * player.hand.length)];
            const cardData = await getCardOrThrow(ctx, randomCard);
            const fieldCard = await getCardOrThrow(ctx, battle.field_card_id);

            // デッキカードかどうか判定
            const deckCards = await getDeckCards(ctx, player.deck_ref);
            const isDeckCard = deckCards.includes(randomCard);

            // スコア計算
            const similarityScore = await calculateSimilarityScore(fieldCard.text, cardData.text);
            const rarityBonus = isDeckCard ? getRarityBonus(cardData.rarity) : 0;
            const finalScore = calculateFinalScore(similarityScore, rarityBonus);

            return {
              ...player,
              submitted_card: {
                card_id: randomCard,
                submission_type: "normal" as const,
                similarity_score: similarityScore,
                rarity_bonus: rarityBonus,
                final_score: finalScore,
                is_deck_card: isDeckCard,
              },
              last_action_time: Date.now(),
            };
          })
        );

        // 勝利宣言があるかチェック
        const hasDeclaration = updatedPlayersSubmission.some(
          (p) => p.submitted_card?.submission_type === "victory_declaration"
        );

        if (hasDeclaration) {
          // 対応フェーズへ移行
          await ctx.db.patch(battle_id, {
            players: updatedPlayersSubmission,
            current_phase: "response",
            phase_start_time: Date.now(),
            responses: [],
            updated_at: Date.now(),
          });
        } else {
          // 判定フェーズへ移行
          await ctx.db.patch(battle_id, {
            players: updatedPlayersSubmission,
            updated_at: Date.now(),
          });
          await transitionToPointCalculation(ctx, battle_id);
        }
        break;
      }

      case "response": {
        // 未応答のプレイヤーは自動的にコール
        const declarerId = battle.players.find(
          (p) => p.submitted_card?.submission_type === "victory_declaration"
        )?.user_id;

        const responses = battle.responses || [];
        const nonDeclarers = battle.players.filter((p) => p.user_id !== declarerId);

        nonDeclarers.forEach((player) => {
          const hasResponded = responses.some((r) => r.user_id === player.user_id);
          if (!hasResponded) {
            responses.push({
              user_id: player.user_id,
              response_type: "call",
              timestamp: Date.now(),
            });
          }
        });

        await ctx.db.patch(battle_id, {
          responses,
          updated_at: Date.now(),
        });

        await transitionToPointCalculation(ctx, battle_id);
        break;
      }

      case "point_calculation": {
        // 自動的に次のラウンドへ
        const updatedBattle = await ctx.db.get(battle_id);
        if (updatedBattle && updatedBattle.game_status !== "finished") {
          // 新しいお題カードを選択
          const newFieldCard = await getRandomFieldCard(ctx);

          // プレイヤー状態をリセット
          const resetPlayers = updatedBattle.players.map((player) => ({
            ...player,
            turn_state: {
              actions_remaining: 3n,
              actions_log: [],
              deck_cards_remaining: player.turn_state.deck_cards_remaining,
            },
            submitted_card: undefined,
            is_ready: false,
            last_action_time: Date.now(),
          }));

          // 次のラウンドへ
          await ctx.db.patch(battle_id, {
            current_round: updatedBattle.current_round + 1n,
            current_phase: "field_card_presentation",
            field_card_id: newFieldCard,
            players: resetPlayers,
            phase_start_time: Date.now(),
            responses: undefined,
            updated_at: Date.now(),
          });
        }
        break;
      }
    }

    return { timedOut: true };
  },
});
