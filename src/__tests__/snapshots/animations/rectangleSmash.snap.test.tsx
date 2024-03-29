import { render } from "@testing-library/react-native";

import { RectangleSmash } from "@/animations/attacks/rectangleSmash";

describe("Grenade Fragment - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<RectangleSmash />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
