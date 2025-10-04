// レアリティマッピング関数
export function mapRarityToJapanese(rarity: string): "並" | "良" | "優" | "傑" | "極" {
  const rarityMap: Record<string, "並" | "良" | "優" | "傑" | "極"> = {
    common: "並",
    rare: "良",
    super_rare: "優",
    epic: "傑",
    legendary: "極",
  };
  return rarityMap[rarity.toLowerCase()] || "並";
}
