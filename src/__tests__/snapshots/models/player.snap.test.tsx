import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Player, { PlayerData } from "@/models/player";

describe("Player model - Snapshot test", () => {
  it("Should renders correctly", () => {
    const data = renderHook(() => useSharedValue<PlayerData>({ x: 25, y: 50 }));

    const tree = render(<Player data={data.result.current} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
