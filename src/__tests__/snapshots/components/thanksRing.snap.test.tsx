import { render } from "test-utils";

import Ring from "@/components/game/thanks/ring";

describe("Thanks Ring - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Ring start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
