import { render } from "test-utils";

import Options from "@/components/game/gameOver/options";

describe("Game Over Options - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Options />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
