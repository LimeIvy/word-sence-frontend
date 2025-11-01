import type { Meta, StoryObj } from "@storybook/nextjs";
import { HandCard } from "./HandCard";

const meta = {
  title: "Battle/HandCard",
  component: HandCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "tatami",
      values: [
        {
          name: "tatami",
          value: "linear-gradient(135deg, rgba(139,115,85,0.8) 0%, rgba(101,84,63,0.9) 100%)",
        },
        { name: "dark", value: "#1e293b" },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HandCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本（未選択）
export const Default: Story = {
  args: {
    word: "実験",
    rarity: "良",
    selected: false,
    isDeckCard: true,
  },
};

// 選択状態
export const Selected: Story = {
  args: {
    word: "実験",
    rarity: "良",
    selected: true,
    isDeckCard: true,
  },
};

// 類似度表示あり
export const WithSimilarity: Story = {
  args: {
    word: "科学",
    rarity: "優",
    selected: false,
    showSimilarity: true,
    similarity: 0.852,
    isDeckCard: true,
  },
};

// 類似度+ボーナス表示
export const WithBonus: Story = {
  args: {
    word: "理論",
    rarity: "傑",
    selected: false,
    showSimilarity: true,
    similarity: 0.782,
    rarityBonus: 0.05,
    isDeckCard: true,
  },
};

// プールカード（ボーナスなし）
export const PoolCard: Story = {
  args: {
    word: "愛",
    rarity: "並",
    selected: false,
    showSimilarity: true,
    similarity: 0.654,
    isDeckCard: false,
  },
};

// 無効状態
export const Disabled: Story = {
  args: {
    word: "進化",
    rarity: "良",
    selected: false,
    disabled: true,
    isDeckCard: true,
  },
};

// レアリティ：並
export const RarityCommon: Story = {
  args: {
    word: "木の葉",
    rarity: "並",
    selected: false,
    isDeckCard: true,
  },
};

// レアリティ：良
export const RarityRare: Story = {
  args: {
    word: "若竹",
    rarity: "良",
    selected: false,
    isDeckCard: true,
  },
};

// レアリティ：優
export const RarityEpic: Story = {
  args: {
    word: "青嵐",
    rarity: "優",
    selected: false,
    isDeckCard: true,
  },
};

// レアリティ：傑
export const RarityLegendary: Story = {
  args: {
    word: "紫雲",
    rarity: "傑",
    selected: false,
    isDeckCard: true,
  },
};

// レアリティ：極
export const RarityUltra: Story = {
  args: {
    word: "瑞光",
    rarity: "極",
    selected: false,
    isDeckCard: true,
  },
};

// 高スコア（選択状態 + 詳細表示）
export const HighScore: Story = {
  args: {
    word: "宇宙",
    rarity: "優",
    selected: true,
    showSimilarity: true,
    similarity: 0.95,
    rarityBonus: 0.05,
    isDeckCard: true,
  },
};

// 低スコア
export const LowScore: Story = {
  args: {
    word: "机",
    rarity: "並",
    selected: false,
    showSimilarity: true,
    similarity: 0.125,
    isDeckCard: true,
  },
};
