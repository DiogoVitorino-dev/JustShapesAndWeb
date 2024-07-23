import { render } from "@testing-library/react-native";

import Presentation from "@/components/preMenu/presentation";

describe("Presentation - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Presentation />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
