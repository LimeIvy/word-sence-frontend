import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

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
        index: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    console.log("getCardsByDetails - args:", args);

    if (args.requests.length === 0) {
      console.log("getCardsByDetails - empty requests, returning []");
      return [];
    }

    const allCards = [];

    // 各リクエストに対して個別にクエリを実行
    for (const req of args.requests) {
      try {
        const card = await ctx.db
          .query("card")
          .withIndex("by_rarity_and_number", (q) =>
            q.eq("rarity", req.rarity).eq("card_number", String(req.index))
          )
          .first();

        if (card) {
          allCards.push(card);
          console.log(`getCardsByDetails - found card: ${card.card_number} (${card.rarity})`);
        } else {
          console.log(`getCardsByDetails - card not found: ${req.index} (${req.rarity})`);
        }
      } catch (error) {
        console.error(
          `getCardsByDetails - error querying card ${req.index} (${req.rarity}):`,
          error
        );
      }
    }

    console.log("getCardsByDetails - individual queries completed, total cards:", allCards.length);
    return allCards;
  },
});
