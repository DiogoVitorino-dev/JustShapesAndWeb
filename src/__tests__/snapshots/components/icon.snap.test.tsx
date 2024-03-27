import { render } from "@testing-library/react-native";

import { Icon } from "@/components/shared";

describe("Icon - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Icon name="add" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
