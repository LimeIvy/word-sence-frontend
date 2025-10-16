import { rarities, type RarityConfig } from "../types/ratity";

// 重み付き抽選でレアリティを決める
export function pickRarity(rand = Math.random()): RarityConfig {
  let cumulative = 0;
  for (const r of rarities) {
    cumulative += r.probability;
    if (rand < cumulative) return r;
  }
  return rarities[rarities.length - 1];
}

// 各レアリティのカード番号の開始位置を定義
const RARITY_START_INDICES = {
  legendary: 1,
  epic: 76,
  super_rare: 751,
  rare: 3001,
  common: 7501,
} as const;

// 乱数でカード番号を選ぶ（実際のデータベースのカード番号に対応）
export function pickIndexInRarity(rarity: RarityConfig, rand = Math.random()): number {
  if (rarity.count <= 0) return 0;

  // レアリティに対応するクエリ名から実際のレアリティキーを取得
  const queryNameToRarity: Record<string, keyof typeof RARITY_START_INDICES> = {
    getLegendary: "legendary",
    getEpic: "epic",
    getSuperRare: "super_rare",
    getRare: "rare",
    getCommon: "common",
  };

  const rarityKey = queryNameToRarity[rarity.queryName];
  if (!rarityKey) return 0;

  const startIndex = RARITY_START_INDICES[rarityKey];
  const idx = Math.floor(rand * rarity.count);
  const cardIndex = Math.min(Math.max(idx, 0), rarity.count - 1);

  // 実際のカード番号を返す（1ベース）
  return startIndex + cardIndex;
}

// ガチャ1回分のインデックスを返す
export type GachaRoll = {
  rarity: "common" | "rare" | "super_rare" | "epic" | "legendary";
  cardIndex: number;
};

export function rollGacha(): GachaRoll {
  const rarity = pickRarity();
  const cardIndex = pickIndexInRarity(rarity);
  const queryNameToKey: Record<string, GachaRoll["rarity"]> = {
    getLegendary: "legendary",
    getEpic: "epic",
    getSuperRare: "super_rare",
    getRare: "rare",
    getCommon: "common",
  };
  return { rarity: queryNameToKey[rarity.queryName] ?? "common", cardIndex };
}

// ガチャ10回分のインデックスを返す
export function rollGacha10(): GachaRoll[] {
  const results: GachaRoll[] = [];
  for (let i = 0; i < 10; i++) {
    results.push(rollGacha());
  }
  return results;
}
