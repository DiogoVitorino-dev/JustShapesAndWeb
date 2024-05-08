import { render } from "test-utils";

import Thanks from "@/components/game/thanks";

describe("Thanks - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Thanks />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
