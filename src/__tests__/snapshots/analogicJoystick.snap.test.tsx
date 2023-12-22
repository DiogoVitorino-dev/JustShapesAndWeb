import { render } from "@testing-library/react-native";

import AnalogicJoystick from "@/controllers/mobile/analogic";

describe("Analogic Joystick - Snapshot mobile controller test", () => {
  it("should render correctly", () => {
    const tree = render(
      <AnalogicJoystick onMove={() => {}} size={300} velocity={50} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
