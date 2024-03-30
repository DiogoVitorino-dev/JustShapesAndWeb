import { render } from "@testing-library/react-native";

import { Flash } from "@/animations/effects/flash";

describe("Grenade - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<Flash start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
