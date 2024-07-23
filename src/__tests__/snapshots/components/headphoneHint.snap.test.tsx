import { render } from "@testing-library/react-native";

import HeadphoneHint from "@/components/preMenu/headphoneHint";

describe("Headphone Hint - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<HeadphoneHint />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
