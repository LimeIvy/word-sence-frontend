import type { Rarity, RarityConfig, RarityJapanese } from "../types/rarity";
import { RARITY_CONFIGS, RARITY_ORDER } from "../types/rarity";

/**
 * 英語キーから日本語表示に変換
 */
export function mapRarityToJapanese(rarity: string): RarityJapanese {
  const rarityKey = rarity.toLowerCase() as Rarity;
  return RARITY_CONFIGS[rarityKey]?.value || "並";
}

/**
 * 日本語表示から英語キーに変換
 */
export function mapJapaneseToRarity(japanese: RarityJapanese): Rarity {
  const entry = Object.entries(RARITY_CONFIGS).find(([, config]) => config.value === japanese);
  return (entry?.[0] as Rarity) || "common";
}

/**
 * レアリティの表示名を取得
 */
export function getRarityDisplayName(rarity: Rarity): string {
  return RARITY_CONFIGS[rarity]?.displayName || "コモン";
}

/**
 * レアリティのボーナス値を取得
 */
export function getRarityBonus(rarity: Rarity): number {
  return RARITY_CONFIGS[rarity]?.bonus || 0.0;
}

/**
 * レアリティの出現確率を取得
 */
export function getRarityProbability(rarity: Rarity): number {
  return RARITY_CONFIGS[rarity]?.probability || 0.0;
}

/**
 * レアリティのカード総数を取得
 */
export function getRarityCount(rarity: Rarity): number {
  return RARITY_CONFIGS[rarity]?.count || 0;
}

/**
 * レアリティの設定を取得
 */
export function getRarityConfig(rarity: Rarity): RarityConfig {
  return RARITY_CONFIGS[rarity] || RARITY_CONFIGS.common;
}

/**
 * 最も高いレアリティを取得
 */
export function getHighestRarity(rarities: Rarity[]): Rarity {
  for (const rarity of RARITY_ORDER) {
    if (rarities.includes(rarity)) {
      return rarity;
    }
  }
  return "common";
}

/**
 * レアリティを比較（高い方が正の値）
 */
export function compareRarity(rarity1: Rarity, rarity2: Rarity): number {
  const index1 = RARITY_ORDER.indexOf(rarity1);
  const index2 = RARITY_ORDER.indexOf(rarity2);
  return index2 - index1; // 逆順（高い方が小さいインデックス）
}

/**
 * レアリティが有効かチェック
 */
export function isValidRarity(rarity: string): rarity is Rarity {
  return rarity in RARITY_CONFIGS;
}
