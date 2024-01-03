import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Player, {
  PlayerAngle,
  PlayerPosition,
  PlayerSize,
} from "@/models/player";

describe("Player model - Snapshot test", () => {
  it("Should renders correctly", () => {
    let pos: PlayerPosition;
    let angle: PlayerAngle;
    let size: PlayerSize;

    renderHook(() => {
      pos = useSharedValue({ x: 25, y: 50 });
      angle = useSharedValue(90);
      size = useSharedValue({ width: 100, height: 50 });
    });

    //@ts-expect-error
    const tree = render(<Player angle={angle} position={pos} size={size} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
