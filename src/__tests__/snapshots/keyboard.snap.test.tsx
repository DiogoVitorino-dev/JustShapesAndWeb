/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react-native";

import Keyboard from "@/controllers/keyboard";

describe("Keyboard controller - snapshot test", () => {
  it("should render correctly", () => {
    const tree = render(
      <Keyboard
        velocity={100}
        onMove={() => {}}
        dashDuration={10}
        dashMultiplier={2}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
