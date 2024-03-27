import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import Circle, { CircleData } from "@/models/geometric/circle";

describe("Circle model - Snapshot test", () => {
  it("Should renders correctly", () => {
    const data = renderHook(() => useSharedValue<CircleData>({ x: 25, y: 50 }));

    const tree = render(<Circle data={data.result.current} />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
