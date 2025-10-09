import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  card: defineTable({
    text: v.string(),
    rarity: v.string(),
  }),
});
