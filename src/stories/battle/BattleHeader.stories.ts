import type { Meta, StoryObj } from "@storybook/nextjs";
import { BattleHeader } from "./BattleHeader";

const meta = {
  title: "Battle/BattleHeader",
  component: BattleHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BattleHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// ゲーム開始直後（ラウンド1、アクションフェーズ）
export const GameStart: Story = {
  args: {
    player1Name: "プレイヤー1",
    player1Score: 0,
    player2Name: "あなた",
    player2Score: 0,
    currentRound: 1,
    currentPhase: "player_action",
  },
};

// アクションフェーズ進行中
export const ActionPhase: Story = {
  args: {
    player1Name: "山田太郎",
    player1Score: 1,
    player2Name: "田中花子",
    player2Score: 1,
    currentRound: 3,
    currentPhase: "player_action",
  },
};

// 提出フェーズ
export const SubmissionPhase: Story = {
  args: {
    player1Name: "山田太郎",
    player1Score: 1,
    player2Name: "田中花子",
    player2Score: 2,
    currentRound: 4,
    currentPhase: "word_submission",
  },
};

// 対応フェーズ（勝利宣言があった場合）
export const ResponsePhase: Story = {
  args: {
    player1Name: "山田太郎",
    player1Score: 2,
    player2Name: "田中花子",
    player2Score: 2,
    currentRound: 5,
    currentPhase: "response",
  },
};

// 判定フェーズ
export const PointCalculationPhase: Story = {
  args: {
    player1Name: "山田太郎",
    player1Score: 2,
    player2Name: "田中花子",
    player2Score: 2,
    currentRound: 5,
    currentPhase: "point_calculation",
  },
};

// タイマー残り少ない（緊急状態）
export const UrgentTimer: Story = {
  args: {
    player1Name: "プレイヤーA",
    player1Score: 1,
    player2Name: "プレイヤーB",
    player2Score: 1,
    currentRound: 2,
    currentPhase: "word_submission",
  },
};

// 接戦（2-2）
export const CloseMatch: Story = {
  args: {
    player1Name: "エース",
    player1Score: 2,
    player2Name: "チャレンジャー",
    player2Score: 2,
    currentRound: 7,
    currentPhase: "player_action",
  },
};

// 一方的な展開
export const OneSidedMatch: Story = {
  args: {
    player1Name: "ベテラン",
    player1Score: 0,
    player2Name: "初心者",
    player2Score: 3,
    currentRound: 3,
    currentPhase: "point_calculation",
  },
};

// お題カード提示フェーズ
export const NoTimer: Story = {
  args: {
    player1Name: "プレイヤー1",
    player1Score: 1,
    player2Name: "プレイヤー2",
    player2Score: 0,
    currentRound: 2,
    currentPhase: "field_card_presentation",
  },
};

// 長い名前のテスト
export const LongNames: Story = {
  args: {
    player1Name: "非常に長いプレイヤー名の例です",
    player1Score: 2,
    player2Name: "こちらも非常に長いプレイヤー名の例です",
    player2Score: 1,
    currentRound: 3,
    currentPhase: "word_submission",
  },
};
