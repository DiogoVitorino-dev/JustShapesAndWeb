/**
 * @jest-environment jsdom
 */

import { render } from "../testsUtils";

import WebControl from "@/controllers/web";

describe("Web Control - Snapshot web control test", () => {
  it("should render correctly", () => {
    const tree = render(
      <WebControl velocity={100} onMove={() => {}} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
