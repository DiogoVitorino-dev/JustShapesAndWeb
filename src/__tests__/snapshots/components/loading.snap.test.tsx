import { render } from "@testing-library/react-native";

import { Loading } from "@/components/shared";

describe("Loading - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<Loading />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
