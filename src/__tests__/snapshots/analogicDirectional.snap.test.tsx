import { render } from "@testing-library/react-native";

import { AnalogicDirectional } from "@/controllers/mobile/directional";

describe("Analogic Directional - Snapshot mobile controller test", () => {
  it("should render correctly", () => {
    const tree = render(
      <AnalogicDirectional onMove={() => {}} size={300} velocity={50} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
