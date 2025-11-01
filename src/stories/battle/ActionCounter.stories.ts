import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActionCounter } from "./ActionCounter";

const meta = {
  title: "Battle/ActionCounter",
  component: ActionCounter,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1e293b" }],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActionCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

// 初期状態（3回）
export const Full: Story = {
  args: {
    actionsRemaining: 3,
    maxActions: 3,
  },
};

// 2回残り
export const Two: Story = {
  args: {
    actionsRemaining: 2,
    maxActions: 3,
  },
};

// 1回残り（警告）
export const OneWarning: Story = {
  args: {
    actionsRemaining: 1,
    maxActions: 3,
  },
};

// 使い切り
export const Empty: Story = {
  args: {
    actionsRemaining: 0,
    maxActions: 3,
  },
};

// 小サイズ
export const SmallSize: Story = {
  args: {
    actionsRemaining: 2,
    maxActions: 3,
    size: "small",
  },
};

// 大サイズ
export const LargeSize: Story = {
  args: {
    actionsRemaining: 3,
    maxActions: 3,
    size: "large",
  },
};
