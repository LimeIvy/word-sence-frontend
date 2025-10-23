import { RarityEnum } from "./gacha";

export type GachaState = "idle" | "rolling" | "result";

export type GachaResultType = {
  requests: {
    rarity: RarityEnum;
    cardNumber: string;
  }[];
} | null;
