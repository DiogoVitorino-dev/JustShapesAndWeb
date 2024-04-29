import { act, render, waitFor } from "@testing-library/react-native";

import { Grenade } from "@/animations/attacks/grenade";

describe("Grenade - Snapshot animation test", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it("should render correctly", async () => {
    const tree = render(<Grenade start={false} />).toJSON();
    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(5000);
      }),
    );
    expect(tree).toMatchSnapshot();
  });
});
