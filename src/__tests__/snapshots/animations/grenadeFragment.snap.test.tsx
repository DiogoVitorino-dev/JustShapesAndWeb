import { act, render, waitFor } from "@testing-library/react-native";

import GrenadeFragment from "@/animations/attacks/grenade/grenadeFragment";

describe("Grenade Fragment - Snapshot animation test", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it("should render correctly", async () => {
    const tree = render(
      <GrenadeFragment angleDirection={90} start={false} />,
    ).toJSON();
    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(5000);
      }),
    );
    expect(tree).toMatchSnapshot();
  });
});
