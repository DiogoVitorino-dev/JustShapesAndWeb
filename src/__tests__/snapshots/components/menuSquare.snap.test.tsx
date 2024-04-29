import { render } from "@testing-library/react-native";

import MenuSquare from "@/components/menu/menuSquare";

describe("Menu Square - Snapshot component test", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it("should render correctly", () => {
    const tree = render(<MenuSquare />).toJSON();
    jest.advanceTimersByTime(5000);
    expect(tree).toMatchSnapshot();
  });
});
