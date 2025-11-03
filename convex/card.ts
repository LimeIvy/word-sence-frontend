import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./user";

const rarityValidator = v.union(
  v.literal("common"),
  v.literal("rare"),
  v.literal("super_rare"),
  v.literal("epic"),
  v.literal("legendary")
);

export const getLegendary = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("card")
      .withIndex("by_rarity", (q) => q.eq("rarity", "legendary"))
      .collect();
  },
});

export const getEpic = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .withIndex("by_rarity", (q) => q.eq("rarity", "epic"))
      .paginate(args.paginationOpts);
  },
});

export const getSuperRare = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .withIndex("by_rarity", (q) => q.eq("rarity", "super_rare"))
      .paginate(args.paginationOpts);
  },
});

export const getRare = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .withIndex("by_rarity", (q) => q.eq("rarity", "rare"))
      .paginate(args.paginationOpts);
  },
});

export const getCommon = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .withIndex("by_rarity", (q) => q.eq("rarity", "common"))
      .paginate(args.paginationOpts);
  },
});

export const getCardsByDetails = query({
  args: {
    requests: v.array(
      v.object({
        rarity: rarityValidator,
        cardNumber: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (args.requests.length === 0) {
      return [];
    }

    const allCards = [];

    // 各リクエストに対して個別にクエリを実行
    for (const req of args.requests) {
      try {
        const card = await ctx.db
          .query("card")
          .withIndex("by_rarity_and_number", (q) =>
            q.eq("rarity", req.rarity).eq("card_number", req.cardNumber)
          )
          .first();

        if (card) {
          allCards.push(card);
        } else {
          console.log(`getCardsByDetails - card not found: ${req.cardNumber} (${req.rarity})`);
        }
      } catch (error) {
        console.error(
          `getCardsByDetails - error querying card ${req.cardNumber} (${req.rarity}):`,
          error
        );
      }
    }

    return allCards;
  },
});

/**
 * カードIDの配列からカード情報を一括取得
 */
export const getCardsByIds = query({
  args: {
    cardIds: v.array(v.id("card")),
  },
  handler: async (ctx, { cardIds }) => {
    if (cardIds.length === 0) {
      return [];
    }

    // 並列でカードを取得
    const cards = await Promise.all(
      cardIds.map(async (cardId) => {
        try {
          const card = await ctx.db.get(cardId);
          return card;
        } catch (error) {
          console.error(`getCardsByIds - error fetching card ${cardId}:`, error);
          return null;
        }
      })
    );

    return cards.filter((card): card is NonNullable<typeof card> => card !== null);
  },
});

//ユーザの所持カードを取得する
export const getUserCards = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }
    return await ctx.db
      .query("user_card")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();
  },
});

//ユーザの所持カードを詳細情報付きで取得する
export const getUserCardsWithDetails = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }

    const userCards = await ctx.db
      .query("user_card")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();

    // カードの詳細情報を取得
    const cardsWithDetails = await Promise.all(
      userCards.map(async (userCard) => {
        const card = await ctx.db.get(userCard.card_id);
        if (!card) {
          return null;
        }

        return {
          id: userCard._id,
          user_id: userCard.user_id,
          card_id: userCard.card_id,
          quantity: userCard.quantity,
          acquired_at: userCard.acquired_at,
          is_locked: false, // デフォルト値
          card: card,
        };
      })
    );

    return cardsWithDetails.filter(Boolean);
  },
});

// ユーザの所持カードを追加する
export const addUserCard = mutation({
  args: { cardNumber: v.string() },
  handler: async (ctx, { cardNumber }) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }
    const card = await ctx.db
      .query("card")
      .withIndex("by_card_number", (q) => q.eq("card_number", cardNumber))
      .first();
    if (!card) {
      throw new Error("カードが見つかりません");
    }
    const userCard = await ctx.db
      .query("user_card")
      .withIndex("by_user_and_card", (q) => q.eq("user_id", user._id).eq("card_id", card._id))
      .first();
    if (userCard) {
      await ctx.db.patch(userCard._id, {
        quantity: userCard.quantity + 1n,
        acquired_at: Date.now(),
      });
    } else {
      try {
        await ctx.db.insert("user_card", {
          user_id: user._id,
          card_id: card._id,
          quantity: 1n,
          acquired_at: Date.now(),
        });
      } catch (error) {
        // 並行挿入の競合が発生した場合、再度クエリして更新
        const existingCard = await ctx.db
          .query("user_card")
          .withIndex("by_user_and_card", (q) => q.eq("user_id", user._id).eq("card_id", card._id))
          .first();
        if (existingCard) {
          await ctx.db.patch(existingCard._id, {
            quantity: existingCard.quantity + 1n,
            acquired_at: Date.now(),
          });
        } else {
          throw error;
        }
      }
    }
    return { success: true };
  },
});
