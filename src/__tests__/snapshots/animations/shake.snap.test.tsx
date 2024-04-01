import { render } from "@testing-library/react-native";

import { Shake } from "@/animations/effects/shake";

describe("Grenade - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<Shake start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
