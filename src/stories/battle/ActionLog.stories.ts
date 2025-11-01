import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActionLog, type ActionLogEntry } from "./ActionLog";

const meta = {
  title: "Battle/ActionLog",
  component: ActionLog,
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
} satisfies Meta<typeof ActionLog>;

export default meta;
type Story = StoryObj<typeof meta>;

// 空のログ
export const Empty: Story = {
  args: {
    logs: [],
  },
};

// 基本のログ
export const Basic: Story = {
  args: {
    logs: [
      {
        id: "1",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "card_exchange_deck",
        details: { exchangedCount: 2 },
        timestamp: Date.now() - 5000,
      },
      {
        id: "2",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "word_generation",
        details: { generatedWord: "科学技術" },
        timestamp: Date.now() - 3000,
      },
      {
        id: "3",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "ready",
        timestamp: Date.now() - 1000,
      },
    ],
  },
};

// 様々なアクション
export const VariousActions: Story = {
  args: {
    logs: [
      {
        id: "1",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "card_exchange_deck",
        details: { exchangedCount: 3 },
        timestamp: Date.now() - 10000,
      },
      {
        id: "2",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "card_exchange_pool",
        details: { exchangedCount: 1 },
        timestamp: Date.now() - 8000,
      },
      {
        id: "3",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "word_generation",
        details: { generatedWord: "進化論" },
        timestamp: Date.now() - 6000,
      },
      {
        id: "4",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "word_generation",
        details: { generatedWord: "量子力学" },
        timestamp: Date.now() - 4000,
      },
      {
        id: "5",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "card_submission",
        details: { submittedWord: "科学" },
        timestamp: Date.now() - 2000,
      },
      {
        id: "6",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "victory_declaration",
        details: { declaredWord: "技術" },
        timestamp: Date.now() - 1500,
      },
      {
        id: "7",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "call",
        timestamp: Date.now() - 1000,
      },
    ],
  },
};

// ログが多い場合（スクロール可能）
export const ManyLogs: Story = {
  args: {
    logs: Array.from({ length: 20 }, (_, i) => ({
      id: `log-${i}`,
      playerName: i % 2 === 0 ? "山田太郎" : "あなた",
      isOwnAction: i % 2 === 1,
      actionType: [
        "card_exchange_deck",
        "card_exchange_pool",
        "word_generation",
        "card_submission",
        "ready",
      ][i % 5] as ActionLogEntry["actionType"],
      details:
        i % 3 === 0
          ? { exchangedCount: 2 }
          : i % 3 === 1
            ? { generatedWord: `単語${i}` }
            : undefined,
      timestamp: Date.now() - (20 - i) * 1000,
    })),
    maxItems: 10,
  },
};

// 勝利宣言と対応
export const VictoryDeclaration: Story = {
  args: {
    logs: [
      {
        id: "1",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "victory_declaration",
        details: { declaredWord: "勝利" },
        timestamp: Date.now() - 3000,
      },
      {
        id: "2",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "call",
        timestamp: Date.now() - 2000,
      },
      {
        id: "3",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "card_submission",
        details: { submittedWord: "勝利" },
        timestamp: Date.now() - 1000,
      },
    ],
  },
};

// フォールド
export const Fold: Story = {
  args: {
    logs: [
      {
        id: "1",
        playerName: "山田太郎",
        isOwnAction: false,
        actionType: "victory_declaration",
        details: { declaredWord: "究極" },
        timestamp: Date.now() - 3000,
      },
      {
        id: "2",
        playerName: "あなた",
        isOwnAction: true,
        actionType: "fold",
        timestamp: Date.now() - 2000,
      },
    ],
  },
};
