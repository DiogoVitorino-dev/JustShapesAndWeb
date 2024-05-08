import { render } from "test-utils";

import { BouncingText } from "@/components/shared";

describe("Bouncing Text - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<BouncingText start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
