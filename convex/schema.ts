import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  card: defineTable({
    card_number: v.string(),
    text: v.string(),
    rarity: v.string(),
  }),
});
