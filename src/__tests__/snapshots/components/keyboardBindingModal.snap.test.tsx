import { render } from "test-utils";

import KeyboardBindingModal from "@/components/settings/keyboard/keyboardBindingModal";

describe("Keyboard Binding Modal - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(
      <KeyboardBindingModal data={{ command: "UP", key: "primary" }} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
