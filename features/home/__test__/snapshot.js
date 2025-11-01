import Home from "@/app/page";
import { render } from "@testing-library/react";
import React from "react";

it("renders homepage unchanged", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});
