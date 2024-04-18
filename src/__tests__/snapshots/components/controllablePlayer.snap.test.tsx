import { render } from "test-utils";

import ControllablePlayer from "@/components/game/controllablePlayer";

describe("Controllable Player - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<ControllablePlayer />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
