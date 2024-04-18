import { render } from "test-utils";

import Character from "@/components/game/stageName/character";

describe("Stage Name Character - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Character start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
