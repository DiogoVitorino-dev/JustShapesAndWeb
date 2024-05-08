import { render } from "test-utils";

import Character from "@/components/shared/bouncingText/character";

describe("Bouncing Text Character - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Character start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
