import { render } from "test-utils";

import Scene from "@/components/game/scene";

describe("Scene - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Scene data={{ id: 0, duration: 1000 }} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
