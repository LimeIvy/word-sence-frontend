import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getLegendary = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("rarity"), "legendary"))
      .collect();
  },
});

export const getEpic = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("rarity"), "epic"))
      .paginate(args.paginationOpts);
  },
});

export const getSuperRare = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("rarity"), "super_rare"))
      .paginate(args.paginationOpts);
  },
});

export const getRare = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("rarity"), "rare"))
      .paginate(args.paginationOpts);
  },
});

export const getCommon = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("card")
      .filter((q) => q.eq(q.field("rarity"), "common"))
      .paginate(args.paginationOpts);
  },
});

export const getCardsByDetails = query({
  args: {
    requests: v.array(
      v.object({
        rarity: v.string(),
        index: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (args.requests.length === 0) {
      return [];
    }

    const cards = await ctx.db
      .query("card")
      .filter((q) =>
        q.or(
          ...args.requests.map((req) =>
            q.and(
              q.eq(q.field("rarity"), req.rarity),
              q.eq(q.field("card_number"), req.index.toString())
            )
          )
        )
      )
      .collect();

    return cards;
  },
});
