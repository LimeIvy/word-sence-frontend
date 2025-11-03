import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./Button";

const meta = {
  title: "Example/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "対戦",
    className:
      "bg-primary text-white hover:bg-primary/90 hover:scale-103 transition-all duration-200 ease-in-out px-6 py-5 rounded-full text-2xl border-1 border-red-200 shadow-2xl",
  },
};

export const Secondary: Story = {
  args: {
    children: "セカンダリ",
    className:
      "bg-secondary text-white hover:bg-secondary/90 hover:scale-103 transition-all duration-200 ease-in-out px-6 py-5 rounded-full text-2xl border-1 border-red-200 shadow-2xl",
  },
};
