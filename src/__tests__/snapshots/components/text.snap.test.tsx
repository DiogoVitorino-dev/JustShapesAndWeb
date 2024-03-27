import { render } from "@testing-library/react-native";

import { Text } from "@/components/shared";

describe("Text - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Text />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
