import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Rectangle, {
  RectangleAngle,
  RectanglePosition,
  RectangleSize,
} from "@/models/geometric/rectangle";

describe("Rectangle model - Snapshot test", () => {
  it("Should renders correctly", () => {
    let pos: RectanglePosition;
    let angle: RectangleAngle;
    let size: RectangleSize;

    renderHook(() => {
      pos = useSharedValue({ x: 25, y: 50 });
      angle = useSharedValue(90);
      size = useSharedValue({ width: 100, height: 50 });
    });

    //@ts-expect-error
    const tree = render(<Rectangle angle={angle} position={pos} size={size} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
