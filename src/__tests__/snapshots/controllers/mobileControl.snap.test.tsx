/**
 * @jest-environment jsdom
 */

import { render } from "../../testsUtils";

import MobileControl from "@/controllers/mobile";

describe("Mobile Control - Snapshot mobile control test", () => {
  it("should render correctly", () => {
    const tree = render(
      <MobileControl velocity={100} onMove={() => {}} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
