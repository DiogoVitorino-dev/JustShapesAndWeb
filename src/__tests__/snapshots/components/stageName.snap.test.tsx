import { render } from "test-utils";

import StageName from "@/components/game/stageName";

describe("Stage Name - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<StageName />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
