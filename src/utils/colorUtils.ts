import { MathUtils } from "./mathUtils";

export const addTransparency = (source: string, percentage: number) => {
  const { interpolate } = MathUtils;

  function convertThreeDigitToSix(hex: string) {
    const digs = [hex.charAt(1), hex.charAt(2), hex.charAt(3)];
    return "#" + digs[0] + digs[0] + digs[1] + digs[1] + digs[2] + digs[2];
  }

  if (source.search("rgb") !== -1) {
    let alpha = interpolate(
      percentage,
      { min: 0, max: 100 },
      { min: 0, max: 1 },
    );

    alpha = (alpha - 1) * -1; // invert

    source = source.replace("rgb", "rgba");
    source = source.replace(")", `,${alpha})`);
  } else if (source.search("#") !== -1) {
    if (source.length === 4 || source.length === 7) {
      let alpha = interpolate(
        percentage,
        { min: 0, max: 100 },
        { min: 0, max: 255 },
      );

      if (source.length === 4) source = convertThreeDigitToSix(source);

      alpha = Math.floor((alpha - 255) * -1); // invert

      const alphaHex = alpha.toString(16);

      if (alphaHex.length === 1) {
        source += "0" + alphaHex;
      } else {
        source += alphaHex;
      }
    }
  }

  return source;
};

export const ColorUtils = { addTransparency };
