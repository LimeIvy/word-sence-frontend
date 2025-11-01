import type { Meta, StoryObj } from "@storybook/nextjs";
import { HandArea } from "./HandArea";

const meta = {
  title: "Battle/HandArea",
  component: HandArea,
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
} satisfies Meta<typeof HandArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// 通常の手札（5枚）
export const Default: Story = {
  args: {
    cards: [
      { id: "1", word: "実験", rarity: "良", isDeckCard: true },
      { id: "2", word: "理論", rarity: "傑", isDeckCard: true },
      { id: "3", word: "愛", rarity: "並", isDeckCard: false },
      { id: "4", word: "進化", rarity: "優", isDeckCard: true },
      { id: "5", word: "分析", rarity: "良", isDeckCard: true },
    ],
    selectedCardIds: [],
    showSimilarity: false,
  },
};

// 1枚選択状態
export const SingleSelected: Story = {
  args: {
    cards: [
      { id: "1", word: "実験", rarity: "良", isDeckCard: true },
      { id: "2", word: "理論", rarity: "傑", isDeckCard: true },
      { id: "3", word: "愛", rarity: "並", isDeckCard: false },
      { id: "4", word: "進化", rarity: "優", isDeckCard: true },
      { id: "5", word: "分析", rarity: "良", isDeckCard: true },
    ],
    selectedCardIds: ["2"],
    showSimilarity: false,
  },
};

// 複数選択状態
export const MultipleSelected: Story = {
  args: {
    cards: [
      { id: "1", word: "実験", rarity: "良", isDeckCard: true },
      { id: "2", word: "理論", rarity: "傑", isDeckCard: true },
      { id: "3", word: "愛", rarity: "並", isDeckCard: false },
      { id: "4", word: "進化", rarity: "優", isDeckCard: true },
      { id: "5", word: "分析", rarity: "良", isDeckCard: true },
    ],
    selectedCardIds: ["1", "2", "4"],
    multiSelect: true,
    showSimilarity: false,
  },
};

// 類似度表示あり
export const WithSimilarity: Story = {
  args: {
    cards: [
      {
        id: "1",
        word: "実験",
        rarity: "良",
        similarity: 0.852,
        isDeckCard: true,
        rarityBonus: 0.03,
      },
      {
        id: "2",
        word: "理論",
        rarity: "傑",
        similarity: 0.782,
        isDeckCard: true,
        rarityBonus: 0.08,
      },
      { id: "3", word: "愛", rarity: "並", similarity: 0.345, isDeckCard: false },
      {
        id: "4",
        word: "進化",
        rarity: "優",
        similarity: 0.691,
        isDeckCard: true,
        rarityBonus: 0.05,
      },
      {
        id: "5",
        word: "分析",
        rarity: "良",
        similarity: 0.923,
        isDeckCard: true,
        rarityBonus: 0.03,
      },
    ],
    selectedCardIds: ["5"],
    showSimilarity: true,
  },
};

// プレイヤー情報付き
export const WithPlayerInfo: Story = {
  args: {
    cards: [
      { id: "1", word: "科学", rarity: "優", isDeckCard: true },
      { id: "2", word: "研究", rarity: "良", isDeckCard: true },
      { id: "3", word: "データ", rarity: "良", isDeckCard: true },
      { id: "4", word: "発見", rarity: "傑", isDeckCard: true },
      { id: "5", word: "知識", rarity: "並", isDeckCard: false },
    ],
    selectedCardIds: [],
    playerName: "田中花子",
    deckRemaining: 12,
    showSimilarity: false,
  },
};

// デッキ残り少ない
export const LowDeck: Story = {
  args: {
    cards: [
      { id: "1", word: "最後", rarity: "優", isDeckCard: true },
      { id: "2", word: "希望", rarity: "良", isDeckCard: false },
      { id: "3", word: "戦略", rarity: "良", isDeckCard: false },
      { id: "4", word: "勝利", rarity: "傑", isDeckCard: true },
      { id: "5", word: "信念", rarity: "並", isDeckCard: false },
    ],
    selectedCardIds: [],
    playerName: "あなた",
    deckRemaining: 2,
    showSimilarity: false,
  },
};

// 手札空（エッジケース）
export const EmptyHand: Story = {
  args: {
    cards: [],
    selectedCardIds: [],
    playerName: "プレイヤー",
    deckRemaining: 0,
    showSimilarity: false,
  },
};

// 高レアリティばかり
export const HighRarityHand: Story = {
  args: {
    cards: [
      { id: "1", word: "瑞光", rarity: "極", isDeckCard: true },
      { id: "2", word: "紫雲", rarity: "傑", isDeckCard: true },
      { id: "3", word: "青嵐", rarity: "優", isDeckCard: true },
      { id: "4", word: "霊峰", rarity: "傑", isDeckCard: true },
      { id: "5", word: "銀河", rarity: "優", isDeckCard: true },
    ],
    selectedCardIds: ["1"],
    playerName: "エース",
    deckRemaining: 15,
    showSimilarity: false,
  },
};
