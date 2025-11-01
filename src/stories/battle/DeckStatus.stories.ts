import type { Meta, StoryObj } from "@storybook/nextjs";
import { DeckStatus } from "./DeckStatus";

const meta = {
  title: "Battle/DeckStatus",
  component: DeckStatus,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1e293b" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DeckStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

// フル（20枚）
export const Full: Story = {
  args: {
    remaining: 20,
    total: 20,
  },
};

// 半分（10枚）
export const Half: Story = {
  args: {
    remaining: 10,
    total: 20,
  },
};

// 警告（5枚）
export const Warning: Story = {
  args: {
    remaining: 5,
    total: 20,
  },
};

// 危険（2枚）
export const Danger: Story = {
  args: {
    remaining: 2,
    total: 20,
  },
};

// 空
export const Empty: Story = {
  args: {
    remaining: 0,
    total: 20,
  },
};

// 小サイズ
export const SmallSize: Story = {
  args: {
    remaining: 12,
    total: 20,
    size: "small",
  },
};

// 大サイズ
export const LargeSize: Story = {
  args: {
    remaining: 15,
    total: 20,
    size: "large",
  },
};

// カスタムしきい値
export const CustomThresholds: Story = {
  args: {
    remaining: 8,
    total: 20,
    warningThreshold: 10,
    dangerThreshold: 5,
  },
};
