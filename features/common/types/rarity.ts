/**
 * レアリティ型定義（英語キー）
 */
export type Rarity = "common" | "rare" | "super_rare" | "epic" | "legendary";

/**
 * レアリティ型定義（日本語表示）
 */
export type RarityJapanese = "並" | "良" | "優" | "傑" | "極";

/**
 * レアリティクエリ名
 */
export type RarityQueryName = "getCommon" | "getRare" | "getSuperRare" | "getEpic" | "getLegendary";

/**
 * レアリティ設定
 */
export interface RarityConfig {
  value: RarityJapanese;
  key: Rarity;
  queryName: RarityQueryName;
  displayName: string;
  probability: number; // ガチャでの出現確率
  count: number; // レアリティ内のカード総数
  bonus: number; // バトルでのボーナス値
}

/**
 * 全レアリティの設定
 */
export const RARITY_CONFIGS: Record<Rarity, RarityConfig> = {
  common: {
    value: "並",
    key: "common",
    queryName: "getCommon",
    displayName: "コモン",
    probability: 0.5,
    count: 7500,
    bonus: 0.0,
  },
  rare: {
    value: "良",
    key: "rare",
    queryName: "getRare",
    displayName: "レア",
    probability: 0.3,
    count: 4500,
    bonus: 0.03,
  },
  super_rare: {
    value: "優",
    key: "super_rare",
    queryName: "getSuperRare",
    displayName: "スーパーレア",
    probability: 0.15,
    count: 2250,
    bonus: 0.05,
  },
  epic: {
    value: "傑",
    key: "epic",
    queryName: "getEpic",
    displayName: "エピック",
    probability: 0.045,
    count: 675,
    bonus: 0.05,
  },
  legendary: {
    value: "極",
    key: "legendary",
    queryName: "getLegendary",
    displayName: "レジェンド",
    probability: 0.005,
    count: 75,
    bonus: 0.08,
  },
};

/**
 * レアリティの順序（高い順）
 */
export const RARITY_ORDER: Rarity[] = ["legendary", "epic", "super_rare", "rare", "common"];

/**
 * ガチャ用のレアリティ配列（確率計算用）
 */
export const GACHA_RARITIES: RarityConfig[] = [
  RARITY_CONFIGS.legendary,
  RARITY_CONFIGS.epic,
  RARITY_CONFIGS.super_rare,
  RARITY_CONFIGS.rare,
  RARITY_CONFIGS.common,
];

/**
 * 全カードの総数
 */
export const TOTAL_CARDS = 15000;
