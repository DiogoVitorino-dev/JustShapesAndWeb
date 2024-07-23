import { render } from "test-utils";

import Menu from "@/app/(menu)";

describe("Menu - Snapshot app screen test", () => {
  it("should render correctly", () => {
    const tree = render(<Menu />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
