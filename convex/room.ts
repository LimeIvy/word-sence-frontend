import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./user";

/**
 * 現在の認証ユーザーを取得（認証されていない場合はエラー）
 */
async function getCurrentUserOrThrow(ctx: MutationCtx | QueryCtx): Promise<{ _id: Id<"user"> }> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Error("認証されていません。ログインしてください");
  }
  return user;
}

/**
 * デッキ所有権を検証
 */
async function verifyDeckOwnership(
  ctx: MutationCtx | QueryCtx,
  deckId: Id<"deck">,
  userId: Id<"user">
): Promise<void> {
  const deck = await ctx.db.get(deckId);
  if (!deck) {
    throw new Error("デッキが見つかりません");
  }
  if (deck.user_id !== userId) {
    throw new Error("このデッキはあなたのものではありません");
  }
}

/**
 * ユニークなルームコードを生成（6桁の英数字）
 */
function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * ユニークなルームコードを生成（重複チェック付き）
 */
async function generateUniqueRoomCode(ctx: MutationCtx): Promise<string> {
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateRoomCode();
    const existingRoom = await ctx.db
      .query("game_room")
      .withIndex("by_code", (q) => q.eq("room_code", code))
      .first();

    if (!existingRoom) {
      return code;
    }

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error("ルームコードの生成に失敗しました。しばらくしてから再度お試しください");
    }
  } while (true);
}

/**
 * ルームを作成
 */
export const createRoom = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    // 既にアクティブなルームに参加していないかチェック
    const existingRoom = await ctx.db
      .query("game_room")
      .withIndex("by_host", (q) => q.eq("host_id", currentUser._id))
      .filter((q) => q.eq(q.field("is_active"), false))
      .first();

    if (existingRoom) {
      // 既存のルームがある場合はそれを返す
      return { roomId: existingRoom._id, roomCode: existingRoom.room_code };
    }

    // 参加者として既にルームに参加していないかチェック
    const joinedRoom = await ctx.db
      .query("game_room")
      .collect()
      .then((rooms) => rooms.find((r) => r.players.includes(currentUser._id) && !r.is_active));

    if (joinedRoom) {
      return { roomId: joinedRoom._id, roomCode: joinedRoom.room_code };
    }

    // ルームコードを生成
    const roomCode = await generateUniqueRoomCode(ctx);

    // ルームを作成
    const roomId = await ctx.db.insert("game_room", {
      players: [currentUser._id],
      room_code: roomCode,
      host_id: currentUser._id,
      is_active: false,
      battle_id: undefined,
      player_decks: undefined,
    });

    return { roomId, roomCode };
  },
});

/**
 * デッキを選択
 */
export const selectDeck = mutation({
  args: {
    roomId: v.id("game_room"),
    deckId: v.id("deck"),
  },
  handler: async (ctx, { roomId, deckId }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    if (!room.players.includes(currentUser._id)) {
      throw new Error("このルームに参加していません");
    }

    if (room.is_active) {
      throw new Error("対戦中のルームではデッキを変更できません");
    }

    // デッキ所有権を検証
    await verifyDeckOwnership(ctx, deckId, currentUser._id);

    // デッキカード数を確認（最低5枚必要）
    const deckCards = await ctx.db
      .query("deck_card")
      .withIndex("by_deck_id", (q) => q.eq("deck_id", deckId))
      .collect();

    if (deckCards.length < 5) {
      throw new Error("デッキには最低5枚のカードが必要です");
    }

    // プレイヤーのデッキ選択を更新
    const playerDecks = (room.player_decks as Record<string, Id<"deck">> | undefined) ?? {};
    playerDecks[currentUser._id] = deckId;

    await ctx.db.patch(roomId, {
      player_decks: playerDecks,
    });

    return { success: true };
  },
});

/**
 * ルームに参加
 */
export const joinRoom = mutation({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, { roomCode }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    // ルームコードでルームを検索（大文字小文字を区別しない）
    const room = await ctx.db
      .query("game_room")
      .withIndex("by_code", (q) => q.eq("room_code", roomCode.toUpperCase()))
      .first();

    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    if (room.is_active) {
      throw new Error("このルームは既に対戦中です");
    }

    if (room.players.includes(currentUser._id)) {
      // 既に参加している場合はそのまま返す
      return { roomId: room._id, roomCode: room.room_code };
    }

    if (room.players.length >= 2) {
      throw new Error("このルームは満員です");
    }

    // 参加者を追加
    await ctx.db.patch(room._id, {
      players: [...room.players, currentUser._id],
    });

    return { roomId: room._id, roomCode: room.room_code };
  },
});

/**
 * ルームから退出
 */
export const leaveRoom = mutation({
  args: {
    roomId: v.id("game_room"),
  },
  handler: async (ctx, { roomId }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    if (!room.players.includes(currentUser._id)) {
      throw new Error("このルームに参加していません");
    }

    // ホストが退出する場合はルームを削除
    if (room.host_id === currentUser._id) {
      await ctx.db.delete(roomId);
      return { success: true };
    }

    // 参加者が退出する場合は参加者リストから削除
    const updatedPlayers = room.players.filter((id) => id !== currentUser._id);
    await ctx.db.patch(roomId, {
      players: updatedPlayers,
    });

    return { success: true };
  },
});

/**
 * ルーム情報を取得
 */
export const getRoom = query({
  args: {
    roomId: v.id("game_room"),
  },
  handler: async (ctx, { roomId }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const room = await ctx.db.get(roomId);
    if (!room) {
      return null;
    }

    // 参加者のみがルーム情報を取得可能
    if (!room.players.includes(currentUser._id)) {
      throw new Error("このルームに参加していません");
    }

    return room;
  },
});

/**
 * 自分のアクティブなルームを取得
 */
export const getMyRoom = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    // ホストとしてのルームを検索
    const hostRoom = await ctx.db
      .query("game_room")
      .withIndex("by_host", (q) => q.eq("host_id", currentUser._id))
      .filter((q) => q.eq(q.field("is_active"), false))
      .first();

    if (hostRoom) {
      return hostRoom;
    }

    // 参加者としてのルームを検索
    const allRooms = await ctx.db.query("game_room").collect();
    const joinedRoom = allRooms.find((r) => r.players.includes(currentUser._id) && !r.is_active);

    return joinedRoom ?? null;
  },
});

/**
 * バトルを開始
 */
export const startBattle = mutation({
  args: {
    roomId: v.id("game_room"),
  },
  handler: async (ctx, { roomId }): Promise<{ battleId: Id<"battle"> }> => {
    const currentUser = await getCurrentUserOrThrow(ctx);

    const room = await ctx.db.get(roomId);
    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    // ホストのみがバトルを開始可能
    if (room.host_id !== currentUser._id) {
      throw new Error("バトルを開始できるのはホストのみです");
    }

    if (room.is_active) {
      throw new Error("このルームは既に対戦中です");
    }

    // 2人が参加していることを確認
    if (room.players.length !== 2) {
      throw new Error("バトルを開始するには2人が参加している必要があります");
    }

    // 各プレイヤーがデッキを選択していることを確認
    const playerDecks = (room.player_decks as Record<string, Id<"deck">> | undefined) ?? {};
    const deck1 = playerDecks[room.players[0]];
    const deck2 = playerDecks[room.players[1]];

    if (!deck1 || !deck2) {
      throw new Error("全プレイヤーがデッキを選択する必要があります");
    }

    // バトルを作成（createBattleを呼び出す）
    // ホストが両プレイヤーの一人として認証されているため、createBattleを直接呼び出す
    const battleResult = await ctx.runMutation(api.battle.createBattle, {
      player_ids: room.players,
      deck_ids: [deck1, deck2],
    });

    // ルームを更新
    await ctx.db.patch(roomId, {
      battle_id: battleResult.battleId,
      is_active: true,
    });

    return { battleId: battleResult.battleId };
  },
});

/**
 * ルームコードでルームを検索
 */
export const getRoomByCode = query({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, { roomCode }) => {
    const room = await ctx.db
      .query("game_room")
      .withIndex("by_code", (q) => q.eq("room_code", roomCode.toUpperCase()))
      .first();

    if (!room) {
      return null;
    }

    return room;
  },
});
