type RarityKey = "getCommon" | "getRare" | "getSuperRare" | "getEpic" | "getLegendary";

export type RarityConfig = {
  value: string;
  queryName: RarityKey;
  probability: number; // レアリティの出現確率
  count: number; // レアリティ内のカード総数
};

export const TOTAL_CARDS = 15000;

export const rarities: RarityConfig[] = [
  {
    value: "並",
    queryName: "getCommon",
    probability: 0.5,
    count: 7500,
  },
  {
    value: "良",
    queryName: "getRare",
    probability: 0.3,
    count: 4500,
  },
  {
    value: "優",
    queryName: "getSuperRare",
    probability: 0.15,
    count: 2250,
  },
  {
    value: "傑",
    queryName: "getEpic",
    probability: 0.045,
    count: 675,
  },
  {
    value: "極",
    queryName: "getLegendary",
    probability: 0.005,
    count: 75,
  },
];
