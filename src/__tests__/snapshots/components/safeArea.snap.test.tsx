import { render } from "test-utils";

import { SafeArea } from "@/components/shared";

describe("Safe Area - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<SafeArea />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
