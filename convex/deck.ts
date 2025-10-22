import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./user";

// ユーザの全デッキを取得する
export const getUserDecks = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }
    return await ctx.db
      .query("deck")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();
  },
});

// デッキを作成する
export const createDeck = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }
    return await ctx.db.insert("deck", {
      user_id: user._id,
      deck_name: name,
    });
  },
});

// デッキ名を更新する
export const updateDeck = mutation({
  args: { deckId: v.id("deck"), name: v.string() },
  handler: async (ctx, { deckId, name }) => {
    return await ctx.db.patch(deckId, {
      deck_name: name,
    });
  },
});

// デッキを削除する
export const deleteDeck = mutation({
  args: { deckId: v.id("deck") },
  handler: async (ctx, { deckId }) => {
    return await ctx.db.delete(deckId);
  },
});

// デッキのカードを保存する
export const saveDeckCards = mutation({
  args: {
    deckId: v.id("deck"),
    cards: v.array(
      v.object({
        card_id: v.id("card"),
        position: v.int64(),
      })
    ),
  },
  handler: async (ctx, { deckId, cards }) => {
    // 既存のデッキカードをすべて削除
    const existingCards = await ctx.db
      .query("deck_card")
      .withIndex("by_deck_id", (q) => q.eq("deck_id", deckId))
      .collect();

    for (const existingCard of existingCards) {
      await ctx.db.delete(existingCard._id);
    }

    // 新しいカードを一括挿入
    for (const card of cards) {
      await ctx.db.insert("deck_card", {
        deck_id: deckId,
        card_id: card.card_id,
        position: card.position,
      });
    }

    return { success: true, cardCount: cards.length };
  },
});
