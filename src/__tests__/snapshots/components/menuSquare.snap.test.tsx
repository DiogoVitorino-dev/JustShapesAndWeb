import { render } from "@testing-library/react-native";

import MenuSquare from "@/components/menu/menuSquare";

describe("Menu Square - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<MenuSquare />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
