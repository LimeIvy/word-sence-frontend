import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActionButtons } from "./ActionButtons";

const meta = {
  title: "Battle/ActionButtons",
  component: ActionButtons,
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
} satisfies Meta<typeof ActionButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

// 初期状態
export const Initial: Story = {
  args: {
    exchangeDisabled: false,
    generateDisabled: false,
    readyDisabled: false,
    deckRemaining: 15,
  },
};

// 行動回数1回残り
export const OneActionLeft: Story = {
  args: {
    exchangeDisabled: false,
    generateDisabled: false,
    readyDisabled: false,
    deckRemaining: 10,
  },
};

// 行動回数使い切り
export const NoActionsLeft: Story = {
  args: {
    exchangeDisabled: true,
    generateDisabled: true,
    readyDisabled: false,
    deckRemaining: 8,
  },
};

// デッキ枯渇
export const DeckEmpty: Story = {
  args: {
    exchangeDisabled: true,
    generateDisabled: false,
    readyDisabled: false,
    deckRemaining: 0,
  },
};

// 準備完了のみ可能
export const ReadyOnly: Story = {
  args: {
    exchangeDisabled: true,
    generateDisabled: true,
    readyDisabled: false,
  },
};

// すべて無効（切断時など）
export const AllDisabled: Story = {
  args: {
    exchangeDisabled: true,
    generateDisabled: true,
    readyDisabled: true,
    deckRemaining: 0,
  },
};
