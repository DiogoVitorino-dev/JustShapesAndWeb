import { render } from "test-utils";

import GameOver from "@/components/game/gameOver";

describe("Game Over - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<GameOver />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
