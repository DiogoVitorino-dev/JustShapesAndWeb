import { render } from "test-utils";

import OptionsTextButton from "@/components/game/gameOver/optionsTextButton";

describe("Game Over Options Text Button - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<OptionsTextButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
