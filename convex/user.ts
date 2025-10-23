import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";

// 現在のユーザを取得する
export const getMyUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// 現在のユーザを取得する(プロフィールも取得)
export const getMyUserWithProfile = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUserWithProfile(ctx);
  },
});

// 現在のユーザのプロフィールを更新
export const updateMyProfile = internalMutation({
  args: { name: v.string(), icon: v.string(), gem: v.number() },
  handler: async (ctx, { name, icon, gem }) => {
    const user = await getCurrentUserWithProfile(ctx);
    if (user.profile === null) {
      throw new Error("Profile not found");
    }
    await ctx.db.patch(user.profile._id, {
      name: name,
      icon: icon,
      gem: BigInt(gem),
    });
  },
});

// gemを減らす
export const spendGems = mutation({
  args: { amount: v.number() },
  handler: async (ctx, { amount }) => {
    const user = await getCurrentUserWithProfile(ctx);
    if (user.profile === null) {
      throw new Error("プロフィールが見つかりません");
    }

    const currentGem = Number(user.profile.gem);
    if (currentGem < amount) {
      throw new Error("ジェムが不足しています");
    }

    const newGemAmount = currentGem - amount;
    await ctx.db.patch(user.profile._id, {
      gem: BigInt(newGemAmount),
    });

    return { newGemAmount };
  },
});

// ユーザを取得する
export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await userByClerkId(ctx, clerkId);
    if (user === null) {
      throw new Error("User not found");
    }
    return user;
  },
});

// ユーザが更新されたときに呼び出される (新規登録はtableに挿入)
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userData = {
      clerk_id: data.id,
      email: data.email_addresses[0].email_address,
    };

    const user = await userByClerkId(ctx, data.id);

    if (user === null) {
      const userId = await ctx.db.insert("user", userData);
      await ctx.db.insert("profiles", {
        user_id: userId,
        name: data.first_name ?? "",
        icon: data.image_url,
        gem: BigInt(1000),
      });
    }
  },
});

// ユーザが削除されたときに呼び出される
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`);
    }
  },
});

// 現在のユーザを取得する(nullを返す)
export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

// 現在のユーザを取得する(プロフィールも取得)
export async function getCurrentUserWithProfile(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (user === null) {
    throw new Error("User not found");
  }
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
    .first();
  if (profile === null) {
    throw new Error("Profile not found");
  }
  return {
    user: user._id,
    profile: profile,
  };
}

// Clerk IDを使ってユーザを取得する
async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("user")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerkId))
    .unique();
}
