/**
 * @jest-environment jsdom
 */

import { render } from "../testsUtils";

import Keyboard from "@/controllers/web";

describe("Keyboard controller - Snapshot test", () => {
  it("should render correctly", () => {
    const tree = render(<Keyboard velocity={100} onMove={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
