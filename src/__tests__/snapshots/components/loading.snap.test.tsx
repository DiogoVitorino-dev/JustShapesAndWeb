import { render } from "@testing-library/react-native";

import { Loading } from "@/components/shared";

describe("Loading - Snapshot component test", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("should render correctly", () => {
    const tree = render(<Loading />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
