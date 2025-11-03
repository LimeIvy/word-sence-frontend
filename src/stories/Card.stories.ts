import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "./Card";

const meta = {
  title: "Example/Card",
  component: Card,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1a1a1a" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// 短い単語
export const ShortName: Story = {
  args: {
    children: "愛",
    className: "aspect-3/4 w-32",
    rarity: "並",
  },
};

// 中程度の単語
export const MediumName: Story = {
  args: {
    children: "科学",
    className: "aspect-3/4 w-32",
    rarity: "良",
  },
};

// 長い単語
export const LongName: Story = {
  args: {
    children: "人工知能",
    className: "aspect-3/4 w-32",
    rarity: "優",
  },
};

// レアリティ：並（凡）
export const Rarity_Nami: Story = {
  args: {
    children: "木の葉",
    className: "aspect-3/4 w-32",
    rarity: "並",
    cardId: "001",
  },
};

// レアリティ：良
export const Rarity_Ryo: Story = {
  args: {
    children: "若竹",
    className: "aspect-3/4 w-32",
    rarity: "良",
    cardId: "042",
  },
};

// レアリティ：優
export const Rarity_Yu: Story = {
  args: {
    children: "青嵐",
    className: "aspect-3/4 w-32",
    rarity: "優",
    cardId: "123",
  },
};

// レアリティ：傑（金箔エフェクト）
export const Rarity_Ketsu: Story = {
  args: {
    children: "紫雲",
    className: "aspect-3/4 w-32",
    rarity: "傑",
    cardId: "456",
  },
};

// レアリティ：極（最高レア、アニメーション）
export const Rarity_Goku: Story = {
  args: {
    children: "瑞光",
    className: "aspect-3/4 w-32",
    rarity: "極",
    cardId: "999",
  },
};

// 小サイズ
export const SmallSize: Story = {
  args: {
    children: "希望",
    className: "aspect-3/4 w-20",
    rarity: "優",
  },
};

// 大サイズ
export const LargeSize: Story = {
  args: {
    children: "宇宙",
    className: "aspect-3/4 w-36",
    rarity: "傑",
  },
};
