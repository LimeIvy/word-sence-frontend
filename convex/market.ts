import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./user";

// カードを出品する
export const listCard = mutation({
  args: {
    cardId: v.id("card"),
    price: v.int64(),
  },
  handler: async (ctx, { cardId, price }) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    if (price <= 0) {
      throw new Error("価格は正の値である必要があります");
    }

    // ユーザーがそのカードを持っているかチェック
    const userCard = await ctx.db
      .query("user_card")
      .withIndex("by_user_and_card", (q) => q.eq("user_id", user._id).eq("card_id", cardId))
      .first();

    if (!userCard || userCard.quantity <= 0n) {
      throw new Error("ユーザーはこのカードを所有していません");
    }

    // user_cardからカードを削除
    if (userCard.quantity > 1) {
      await ctx.db.patch(userCard._id, {
        quantity: userCard.quantity - 1n,
      });
    } else {
      // 最後の1枚の場合はレコードを削除
      await ctx.db.delete(userCard._id);
    }

    const now = Date.now();
    await ctx.db.insert("market", {
      user_id: user._id,
      card_id: cardId,
      price: price,
      status: "listed",
      created_at: now,
      updated_at: now,
    });
  },
});

// 出品を取り下げる
export const cancelListing = mutation({
  args: { marketId: v.id("market") },
  handler: async (ctx, { marketId }) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    const listing = await ctx.db.get(marketId);
    if (!listing) throw new Error("出品が見つかりません");

    if (listing.status !== "listed") {
      throw new Error("この出品はキャンセルできません");
    }

    // ユーザーの所有権を確認
    if (listing.user_id !== user._id) {
      throw new Error("このリスティングをキャンセルする権限がありません");
    }

    // 出品を取り下げる
    await ctx.db.patch(marketId, {
      status: "canceled",
      updated_at: Date.now(),
    });

    // user_cardにカードを戻す
    const userCard = await ctx.db
      .query("user_card")
      .withIndex("by_user_and_card", (q) =>
        q.eq("user_id", user._id).eq("card_id", listing.card_id)
      )
      .first();

    if (userCard) {
      await ctx.db.patch(userCard._id, {
        quantity: userCard.quantity + 1n,
      });
    } else {
      await ctx.db.insert("user_card", {
        user_id: user._id,
        card_id: listing.card_id,
        quantity: 1n,
        acquired_at: Date.now(),
      });
    }

    return { success: true };
  },
});

// カードを購入する
export const buyCard = mutation({
  args: { marketId: v.id("market") },
  handler: async (ctx, { marketId }) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    const listing = await ctx.db.get(marketId);
    if (!listing) throw new Error("出品が見つかりません");

    if (listing.status !== "listed") {
      throw new Error("カードは購入できません");
    }

    if (listing.user_id === user._id) {
      throw new Error("自分の出品は購入できません");
    }

    // 取引を実行
    await ctx.db.patch(marketId, {
      status: "sold",
      updated_at: Date.now(),
    });

    // 購入者のジェム残高をチェック
    const buyerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .first();

    if (!buyerProfile || buyerProfile.gem < listing.price) {
      await ctx.db.patch(marketId, {
        status: "listed",
        updated_at: Date.now(),
      });
      throw new Error("ジェムが不足しています");
    }

    // 売り手のプロフィールを取得
    const sellerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("user_id", listing.user_id))
      .first();

    if (!sellerProfile) {
      await ctx.db.patch(marketId, {
        status: "listed",
        updated_at: Date.now(),
      });
      throw new Error("売り手のプロフィールが見つかりません");
    }

    // 販売記録を作成
    await ctx.db.insert("sale_record", {
      buyer_id: user._id,
      seller_id: listing.user_id,
      market_id: marketId,
      price: listing.price,
      created_at: Date.now(),
    });

    // 購入者のジェムを減らし、カードを追加
    await ctx.db.patch(buyerProfile._id, {
      gem: buyerProfile.gem - listing.price,
    });

    // 購入者のカード所持数を更新
    const buyerCard = await ctx.db
      .query("user_card")
      .withIndex("by_user_and_card", (q) =>
        q.eq("user_id", user._id).eq("card_id", listing.card_id)
      )
      .first();

    if (buyerCard) {
      await ctx.db.patch(buyerCard._id, {
        quantity: buyerCard.quantity + 1n,
      });
    } else {
      await ctx.db.insert("user_card", {
        user_id: user._id,
        card_id: listing.card_id,
        quantity: 1n,
        acquired_at: Date.now(),
      });
    }

    await ctx.db.patch(sellerProfile._id, {
      gem: sellerProfile.gem + listing.price,
    });

    return { success: true, price: listing.price };
  },
});

// マーケットの出品一覧を取得
export const getMarketListings = query({
  args: {
    status: v.optional(v.union(v.literal("listed"), v.literal("sold"), v.literal("canceled"))),
  },
  handler: async (ctx, { status }) => {
    const listings = await ctx.db
      .query("market")
      .withIndex("by_status", (q) => q.eq("status", status ?? "listed"))
      .collect();

    // カード情報と出品者情報を結合
    const listingsWithDetails = await Promise.all(
      listings.map(async (listing) => {
        const card = await ctx.db.get(listing.card_id);
        if (!card) return null;
        const seller = await ctx.db.get(listing.user_id);
        const sellerProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("user_id", listing.user_id))
          .first();

        return {
          ...listing,
          card,
          seller: seller ? { ...seller, profile: sellerProfile } : null,
        };
      })
    );

    return listingsWithDetails.filter((listing) => listing !== null);
  },
});

// ユーザーの出品履歴を取得
export const getMyListings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    const listings = await ctx.db
      .query("market")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();

    const myListingsWithDetails = await Promise.all(
      listings.map(async (listing) => {
        const card = await ctx.db.get(listing.card_id);
        return { ...listing, card };
      })
    );

    return myListingsWithDetails;
  },
});

// ユーザーの購入履歴を取得
export const getMyPurchases = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    const purchases = await ctx.db
      .query("sale_record")
      .withIndex("by_buyer_id", (q) => q.eq("buyer_id", user._id))
      .collect();

    const myPurchasesWithDetails = await Promise.all(
      purchases.map(async (purchase) => {
        const market = await ctx.db.get(purchase.market_id);
        const card = market ? await ctx.db.get(market.card_id) : null;
        const seller = market ? await ctx.db.get(market.user_id) : null;

        return {
          ...purchase,
          card,
          seller,
        };
      })
    );

    return myPurchasesWithDetails;
  },
});

// ユーザーの販売履歴を取得
export const getMySales = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("ユーザーが見つかりません");

    const sales = await ctx.db
      .query("sale_record")
      .withIndex("by_seller_id", (q) => q.eq("seller_id", user._id))
      .collect();

    const mySalesWithDetails = await Promise.all(
      sales.map(async (sale) => {
        const market = await ctx.db.get(sale.market_id);
        const card = market ? await ctx.db.get(market.card_id) : null;
        const buyer = await ctx.db.get(sale.buyer_id);

        return {
          ...sale,
          card,
          buyer,
        };
      })
    );

    return mySalesWithDetails;
  },
});
