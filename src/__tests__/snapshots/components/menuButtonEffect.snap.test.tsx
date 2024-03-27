import { render } from "@testing-library/react-native";

import MenuButtonEffect from "@/components/menu/menuButtonEffect";

describe("Menu Button Effect - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<MenuButtonEffect />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
