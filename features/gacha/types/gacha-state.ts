export type GachaState = "idle" | "rolling" | "result";

export type GachaResultType = {
  requests: {
    rarity: "common" | "rare" | "super_rare" | "epic" | "legendary";
    index: number;
  }[];
} | null;
