import { render } from "test-utils";

import SettingsList from "@/app/settings";

describe("Settings List - Snapshot app screen test", () => {
  it("should render correctly", () => {
    const tree = render(<SettingsList />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
