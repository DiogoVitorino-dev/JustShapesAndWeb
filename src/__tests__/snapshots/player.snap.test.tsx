import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Player from "@/components/Player";

describe("Player model - snapshot test", () => {
  it("Should renders correctly", () => {
    const pos = renderHook(() => useSharedValue({ x: 50, y: 150 }));
    const angle = renderHook(() => useSharedValue(270));

    const tree = render(
      <Player
        lookAngle={angle.result.current}
        position={pos.result.current}
        size={25}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
