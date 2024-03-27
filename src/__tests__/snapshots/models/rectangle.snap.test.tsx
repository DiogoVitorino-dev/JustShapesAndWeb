import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Rectangle, { RectangleData } from "@/models/geometric/rectangle";

describe("Rectangle model - Snapshot test", () => {
  it("Should renders correctly", () => {
    const data = renderHook(() =>
      useSharedValue<RectangleData>({ x: 25, y: 50 }),
    );

    const tree = render(<Rectangle data={data.result.current} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
