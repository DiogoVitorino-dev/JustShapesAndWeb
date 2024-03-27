import { render } from "@testing-library/react-native";

import CommandListItem from "@/components/settings/keyboard/commandListItem";

describe("Command List Item - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<CommandListItem command="UP" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
