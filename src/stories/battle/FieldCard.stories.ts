import type { Meta, StoryObj } from "@storybook/nextjs";
import { FieldCard } from "./FieldCard";

const meta = {
  title: "Battle/FieldCard",
  component: FieldCard,
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
        { name: "light", value: "#f1f5f9" },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FieldCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 短い単語
export const ShortWord: Story = {
  args: {
    word: "科学",
    animated: true,
    size: "medium",
  },
};

// 中程度の単語
export const MediumWord: Story = {
  args: {
    word: "宇宙開発",
    animated: true,
    size: "medium",
  },
};

// 長い単語
export const LongWord: Story = {
  args: {
    word: "人工知能技術",
    animated: true,
    size: "medium",
  },
};

// 小サイズ
export const SmallSize: Story = {
  args: {
    word: "愛",
    animated: true,
    size: "small",
  },
};

// 大サイズ
export const LargeSize: Story = {
  args: {
    word: "冒険",
    animated: true,
    size: "large",
  },
};

// アニメーションなし
export const NoAnimation: Story = {
  args: {
    word: "平和",
    animated: false,
    size: "medium",
  },
};

// 実践的な例：ゲーム中
export const InGame1: Story = {
  args: {
    word: "実験",
    animated: false,
    size: "medium",
  },
};

export const InGame2: Story = {
  args: {
    word: "戦略",
    animated: false,
    size: "medium",
  },
};

export const InGame3: Story = {
  args: {
    word: "創造性",
    animated: false,
    size: "medium",
  },
};

// ラウンド開始時（アニメーションあり）
export const RoundStart: Story = {
  args: {
    word: "進化",
    animated: true,
    size: "large",
  },
};
