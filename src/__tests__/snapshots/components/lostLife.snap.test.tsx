import { render } from "test-utils";

import LostLife from "@/components/game/lostLife";

describe("Lost Life - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<LostLife />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
