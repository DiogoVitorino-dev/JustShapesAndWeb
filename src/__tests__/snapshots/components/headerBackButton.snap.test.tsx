import { render } from "@testing-library/react-native";

import AudioSlider from "@/components/settings/audio/audioSlider";

describe("Header Back Button - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<AudioSlider />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
