import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Circle, {
  CirclePosition,
  CircleRadius,
} from "@/models/geometric/circle";

describe("Circle model - Snapshot test", () => {
  let pos: CirclePosition;
  let radius: CircleRadius;

  it("Should renders correctly", () => {
    renderHook(() => {
      pos = useSharedValue({ x: 25, y: 50 });
      radius = useSharedValue(90);
    });

    const tree = render(<Circle radius={radius} position={pos} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
