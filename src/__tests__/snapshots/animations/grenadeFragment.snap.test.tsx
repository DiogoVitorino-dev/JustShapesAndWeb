import { render } from "@testing-library/react-native";

import GrenadeFragment from "@/animations/attacks/grenade/grenadeFragment";

describe("Grenade Fragment - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<GrenadeFragment angleDirection={90} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
