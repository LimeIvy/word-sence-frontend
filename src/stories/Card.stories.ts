import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "./Card";

const meta = {
  title: "Example/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortName: Story = {
  args: {
    children: "ことば",
    className: "aspect-3/4 w-30 text-base tracking-wide",
  },
};

export const LongName: Story = {
  args: {
    children: "ホーム・アンド・アウェー",
    className: "aspect-3/4 w-30 text-base tracking-wide",
  },
};

export const Rarity_Nami: Story = {
  args: {
    children: "木の葉",
    className: "aspect-3/4 w-30 text-base leading-relaxed",
    rarity: "並",
  },
};

export const Rarity_Ryo: Story = {
  args: {
    children: "若竹",
    className: "aspect-3/4 w-30 text-base leading-relaxed",
    rarity: "良",
  },
};

export const Rarity_Yu: Story = {
  args: {
    children: "青嵐",
    className: "aspect-3/4 w-30 text-base leading-relaxed",
    rarity: "優",
  },
};

export const Rarity_Ketsu: Story = {
  args: {
    children: "紫雲",
    className: "aspect-3/4 w-30 text-base leading-relaxed",
    rarity: "傑",
  },
};

export const Rarity_Goku: Story = {
  args: {
    children: "瑞光",
    className: "aspect-3/4 w-30 text-base leading-relaxed",
    rarity: "極",
  },
};
