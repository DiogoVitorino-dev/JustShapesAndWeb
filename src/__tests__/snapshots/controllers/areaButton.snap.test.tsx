import { render } from "@testing-library/react-native";

import { AreaButton } from "@/controllers/mobile/buttons";

describe("Area Button - Snapshot mobile control test", () => {
  it("should render correctly", () => {
    const tree = render(<AreaButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
