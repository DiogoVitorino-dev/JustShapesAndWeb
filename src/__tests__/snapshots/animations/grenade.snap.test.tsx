import { render } from "@testing-library/react-native";

import { Grenade } from "@/animations/attacks/grenade";

describe("Grenade - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<Grenade start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
