import { ColorUtils } from "@/utils/colorUtils";

describe("Testing addTransparency - Color Utils tests", () => {
  const { addTransparency } = ColorUtils;

  it("Should add 50% transparency with HEX color", () => {
    const red = "#ff0000";
    expect(addTransparency(red, 50)).toStrictEqual(red + "7f");
  });

  it("Should add 30% transparency with RGB color", () => {
    const red = "rgb(255,0,0)";
    expect(addTransparency(red, 30)).toStrictEqual("rgba(255,0,0,0.7)");
  });
});
