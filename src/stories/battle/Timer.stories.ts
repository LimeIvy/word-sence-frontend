import type { Meta, StoryObj } from "@storybook/nextjs";
import { Timer } from "./Timer";

const meta = {
  title: "Battle/Timer",
  component: Timer,
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
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 通常状態
export const Normal: Story = {
  args: {
    remainingTime: 50,
    maxTime: 60,
    size: "medium",
  },
};

// 警告状態
export const Warning: Story = {
  args: {
    remainingTime: 15,
    maxTime: 60,
    size: "medium",
  },
};

// 危険状態（赤・点滅）
export const Danger: Story = {
  args: {
    remainingTime: 8,
    maxTime: 60,
    size: "medium",
  },
};

// 小サイズ
export const Small: Story = {
  args: {
    remainingTime: 30,
    maxTime: 60,
    size: "small",
  },
};

// 大サイズ
export const Large: Story = {
  args: {
    remainingTime: 30,
    maxTime: 60,
    size: "large",
  },
};

// アクションフェーズ（60秒）
export const ActionPhase: Story = {
  args: {
    remainingTime: 60,
    maxTime: 60,
    size: "medium",
  },
};

// 提出フェーズ（30秒）
export const SubmissionPhase: Story = {
  args: {
    remainingTime: 30,
    maxTime: 30,
    size: "medium",
  },
};

// 対応フェーズ（20秒）
export const ResponsePhase: Story = {
  args: {
    remainingTime: 20,
    maxTime: 20,
    size: "medium",
  },
};

// カスタムしきい値
export const CustomThresholds: Story = {
  args: {
    remainingTime: 25,
    maxTime: 60,
    size: "medium",
    warningThreshold: 30,
    dangerThreshold: 15,
  },
};
