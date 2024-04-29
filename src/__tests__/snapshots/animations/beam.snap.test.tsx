import { act, render, waitFor } from "@testing-library/react-native";

import { Beam } from "@/animations/attacks/beam";

describe("Beam - Snapshot animation test", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("should render correctly", async () => {
    const tree = render(<Beam start={false} />).toJSON();
    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(5000);
      }),
    );
    expect(tree).toMatchSnapshot();
  });
});
