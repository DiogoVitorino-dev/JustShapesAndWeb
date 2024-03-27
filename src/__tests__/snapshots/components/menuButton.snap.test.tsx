import { render } from "test-utils";

import MenuButton from "@/components/menu/menuButton";

describe("Menu Button - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<MenuButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
