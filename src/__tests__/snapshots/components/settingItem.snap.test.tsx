import { render } from "@testing-library/react-native";

import SettingItem from "@/components/settings/settingItem";

describe("Setting Item - Snapshot component test", () => {
  it("should render correctly", () => {
    const tree = render(
      <SettingItem title="test" icon="add" to="./" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
