import { render } from "@testing-library/react-native";

import { Beam } from "@/animations/attacks/beam";

describe("Beam - Snapshot animation test", () => {
  it("should render correctly", () => {
    const tree = render(<Beam start={false} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
