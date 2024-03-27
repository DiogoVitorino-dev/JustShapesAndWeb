import { render } from "test-utils";

import Keyboard from "@/app/settings/keyboard";

describe("Keyboard Settings - Snapshot app screen test", () => {
  it("should render correctly", () => {
    const tree = render(<Keyboard />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
