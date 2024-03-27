import { render } from "test-utils";

import Menu from "@/app";

describe("Menu - Snapshot app screen test", () => {
  it("should render correctly", () => {
    const tree = render(<Menu />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
