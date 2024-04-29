import { act, render, waitFor } from "@testing-library/react-native";

import { RectangleSmash } from "@/animations/attacks/rectangleSmash";

describe("Grenade Fragment - Snapshot animation test", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("should render correctly", async () => {
    const tree = render(<RectangleSmash start={false} />).toJSON();
    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(5000);
      }),
    );
    expect(tree).toMatchSnapshot();
  });
});
