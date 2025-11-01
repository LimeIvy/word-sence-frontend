import type { Meta, StoryObj } from "@storybook/nextjs";
import { OpponentHand } from "./OpponentHand";

const meta = {
  title: "Battle/OpponentHand",
  component: OpponentHand,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "tatami",
      values: [
        {
          name: "tatami",
          value: "linear-gradient(135deg, rgba(139,115,85,0.8) 0%, rgba(101,84,63,0.9) 100%)",
        },
        { name: "dark", value: "#0f172a" },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OpponentHand>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本表示
export const Default: Story = {
  args: {
    cards: [
      { id: "1", word: "科学", rarity: "優", isDeckCard: true },
      { id: "2", word: "研究", rarity: "良", isDeckCard: true },
      { id: "3", word: "データ", rarity: "良", isDeckCard: true },
      { id: "4", word: "分析", rarity: "傑", isDeckCard: true },
      { id: "5", word: "実験", rarity: "並", isDeckCard: false },
    ],
    playerName: "相手",
  },
};

// プレイヤー名指定
export const WithPlayerName: Story = {
  args: {
    cards: [
      { id: "1", word: "戦略", rarity: "優", isDeckCard: true },
      { id: "2", word: "戦術", rarity: "良", isDeckCard: true },
      { id: "3", word: "計画", rarity: "良", isDeckCard: true },
      { id: "4", word: "実行", rarity: "傑", isDeckCard: true },
      { id: "5", word: "成功", rarity: "並", isDeckCard: false },
    ],
    playerName: "山田太郎",
  },
};

// デッキ残り枚数表示あり
export const WithDeckInfo: Story = {
  args: {
    cards: [
      { id: "1", word: "知識", rarity: "優", isDeckCard: true },
      { id: "2", word: "学習", rarity: "良", isDeckCard: true },
      { id: "3", word: "理解", rarity: "良", isDeckCard: true },
      { id: "4", word: "発見", rarity: "傑", isDeckCard: true },
      { id: "5", word: "探求", rarity: "並", isDeckCard: false },
    ],
    playerName: "田中花子",
    showDeckRemaining: true,
    deckRemaining: 12,
  },
};

// 行動ログ付き
export const WithActionLog: Story = {
  args: {
    cards: [
      { id: "1", word: "進化", rarity: "優", isDeckCard: true },
      { id: "2", word: "変化", rarity: "良", isDeckCard: true },
      { id: "3", word: "成長", rarity: "良", isDeckCard: true },
      { id: "4", word: "発展", rarity: "傑", isDeckCard: true },
      { id: "5", word: "前進", rarity: "並", isDeckCard: false },
    ],
    playerName: "プロプレイヤー",
    recentActions: [
      "カード交換（デッキから2枚）",
      "単語生成（実験 + 理論）",
      "カード交換（プールから1枚）",
    ],
  },
};

// 高レアリティ多め
export const HighRarityHand: Story = {
  args: {
    cards: [
      { id: "1", word: "瑞光", rarity: "極", isDeckCard: true },
      { id: "2", word: "紫雲", rarity: "傑", isDeckCard: true },
      { id: "3", word: "青嵐", rarity: "優", isDeckCard: true },
      { id: "4", word: "霊峰", rarity: "傑", isDeckCard: true },
      { id: "5", word: "銀河", rarity: "優", isDeckCard: true },
    ],
    playerName: "強敵",
    showDeckRemaining: true,
    deckRemaining: 15,
    recentActions: ["カード交換（デッキから3枚）", "単語生成（霊峰 + 銀河）"],
  },
};

// デッキ残り少ない
export const LowDeckRemaining: Story = {
  args: {
    cards: [
      { id: "1", word: "最後", rarity: "優", isDeckCard: true },
      { id: "2", word: "希望", rarity: "良", isDeckCard: false },
      { id: "3", word: "勝利", rarity: "良", isDeckCard: false },
      { id: "4", word: "信念", rarity: "傑", isDeckCard: true },
      { id: "5", word: "決意", rarity: "並", isDeckCard: false },
    ],
    playerName: "追い詰められた相手",
    showDeckRemaining: true,
    deckRemaining: 1,
    recentActions: ["カード交換（プールから3枚）"],
  },
};

// 空の手札（エッジケース）
export const EmptyHand: Story = {
  args: {
    cards: [],
    playerName: "切断中のプレイヤー",
    showDeckRemaining: true,
    deckRemaining: 0,
  },
};
