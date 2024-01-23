import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Circle, {
  CirclePosition,
  CircleRadius,
} from "@/models/geometric/circle";

describe("Circle model - Snapshot test", () => {
  let pos: CirclePosition;
  let diameter: CircleRadius;

  it("Should renders correctly", () => {
    renderHook(() => {
      pos = useSharedValue({ x: 25, y: 50 });
      diameter = useSharedValue(90);
    });

    const tree = render(<Circle diameter={diameter} position={pos} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
