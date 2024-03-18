import { Position } from "@/constants/commonTypes";
import { AnglesUtils } from "@/utils/angleUtils";

// Initial point (0°) - Right middle
// Clockwise

// Values coordinates based on Screen Reference
// Left - Negative X
// Right - Positive X

// Top - Negative Y
// Down - Positive Y

describe("testing shiftAngle - Angle Utils tests", () => {
  it("Should move the angle degree to 90 forward", () => {
    expect(AnglesUtils.shiftAngle(90, 180)).toBe(270);
  });
});

describe("testing getAngleFromPosition - Angle Utils tests", () => {
  // Screen Reference (x,y) x Degrees Range

  // Right - Down (Positive,Positive) =   (0° - 90°)
  it("Should returns 0° degrees", () => {
    expect(AnglesUtils.getAngleFromPosition(90, 0)).toBe(0);
  });

  // Left - Down (Negative,Positive)  =   (90° - 180°)
  it("Should returns 90° ", () => {
    expect(AnglesUtils.getAngleFromPosition(-0, 90)).toBe(90);
  });

  // Right - Up (Negative,Negative)   =   (180° - 270°)
  it("Should returns 180°", () => {
    expect(AnglesUtils.getAngleFromPosition(-90, -0)).toBe(180);
  });

  // Left - Up (Positive,Negative)    =   (270° - 359°)
  it("Should returns 270°", () => {
    expect(AnglesUtils.getAngleFromPosition(0, -90)).toBe(270);
  });

  it("Should returns 359°", () => {
    expect(AnglesUtils.getAngleFromPosition(100, -1).toFixed(0)).toBe("359");
  });
});

describe("testing getDistanceFromAngle - Angle Utils tests", () => {
  const origin: Position = { x: 100, y: 100 };
  const radius = 100;
  const distance = {
    positive: { x: origin.x + radius, y: origin.y + radius },
    negative: { x: origin.x - radius, y: origin.y - radius },
  };

  const { getDistanceFromAngle } = AnglesUtils;

  it.each([
    { angle: 0, expect: [distance.positive.x, origin.y] },
    { angle: 90, expect: [origin.x, distance.positive.y] },
    { angle: 45, expect: [origin.x + 70.7, origin.y + 70.7] },
    { angle: 180, expect: [distance.negative.x, origin.y] },
    { angle: 270, expect: [origin.x, distance.negative.y] },
  ])(
    "Should return to $angle° degree position correctly",
    ({ angle, expect: [expectX, expectY] }) => {
      const { x, y } = getDistanceFromAngle(angle, radius, origin);
      expect(x).toBeCloseTo(expectX, 1);
      expect(y).toBeCloseTo(expectY, 1);
    },
  );
});
