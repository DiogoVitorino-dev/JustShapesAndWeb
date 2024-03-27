import { render } from "test-utils";

import MenuBackground from "@/components/menu/menuBackground";

describe("Menu Background - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<MenuBackground />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
