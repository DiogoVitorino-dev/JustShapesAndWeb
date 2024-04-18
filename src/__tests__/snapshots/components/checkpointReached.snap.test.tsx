import { render } from "test-utils";

import CheckpointReached from "@/components/game/checkpointReached";

describe("Checkpoint Reached - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<CheckpointReached />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
