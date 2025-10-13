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

// 乱数でインデックスを選ぶ
export function pickIndexInRarity(rarity: RarityConfig, rand = Math.random()): number {
  if (rarity.count <= 0) return 0;
  const idx = Math.floor(rand * rarity.count);
  return Math.min(Math.max(idx, 0), rarity.count - 1);
}

// ガチャ1回分のインデックスを返す
export function rollGacha(): {
  cardIndex: number;
} {
  const rarity = pickRarity();
  const cardIndex = pickIndexInRarity(rarity);
  return { cardIndex };
}

// ガチャ10回分のインデックスを返す
export function rollGacha10(): {
  cardIndex: number;
}[] {
  const results: { cardIndex: number }[] = [];
  for (let i = 0; i < 10; i++) {
    results.push(rollGacha());
  }
  return results;
}
