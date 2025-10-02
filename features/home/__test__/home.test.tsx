import Home from "@/app/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    // h1要素を取得
    const heading = screen.getByRole("heading", { level: 1 });

    // h1要素がDOMに存在することを確認
    expect(heading).toBeInTheDocument();
  });
});
