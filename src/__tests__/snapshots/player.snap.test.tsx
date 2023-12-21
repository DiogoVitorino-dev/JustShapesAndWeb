import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Player from "@/models/player";

describe("Player model - snapshot test", () => {
  it("Should renders correctly", () => {
    const pos = renderHook(() => useSharedValue({ x: 25, y: 100 })).result
      .current;
    const angle = renderHook(() => useSharedValue(45)).result.current;

    const tree = render(<Player lookAngle={angle} position={pos} size={25} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
