import { render } from "@testing-library/react-native";

import { View } from "@/components/shared";

describe("View - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<View />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
