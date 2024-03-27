import { render } from "test-utils";

import Audio from "@/app/settings/audio";

describe("Audio Settings - Snapshot app screen test", () => {
  it("should render correctly", () => {
    const tree = render(<Audio />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
