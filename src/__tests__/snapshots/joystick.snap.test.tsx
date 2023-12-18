import { render } from "@testing-library/react-native";

import Joystick from "@/components/Joystick";

describe("JoyStick controller - snapshot test", () => {
  it("should render correctly", () => {
    const tree = render(
      <Joystick onMove={() => {}} size={300} velocity={50} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
