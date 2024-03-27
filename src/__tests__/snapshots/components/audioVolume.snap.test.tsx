import { render } from "@testing-library/react-native";

import AudioVolume from "@/components/settings/audio/audioVolume";

describe("Audio Volume - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(<AudioVolume title="test" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
