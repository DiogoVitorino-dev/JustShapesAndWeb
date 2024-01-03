import { AnglesUtils } from "@/scripts/utils/angleUtils";

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

describe("testing calculateAngle - Angle Utils tests", () => {
  // Screen Reference (x,y) x Degrees Range

  // Right - Down (Positive,Positive) =   (0° - 90°)
  it("Should returns 0° degrees", () => {
    expect(AnglesUtils.calculateAngle(90, 0)).toBe(0);
  });

  // Left - Down (Negative,Positive)  =   (90° - 180°)
  it("Should returns 90° ", () => {
    expect(AnglesUtils.calculateAngle(-0, 90)).toBe(90);
  });

  // Right - Up (Negative,Negative)   =   (180° - 270°)
  it("Should returns 180°", () => {
    expect(AnglesUtils.calculateAngle(-90, -0)).toBe(180);
  });

  // Left - Up (Positive,Negative)    =   (270° - 359°)
  it("Should returns 270°", () => {
    expect(AnglesUtils.calculateAngle(0, -90)).toBe(270);
  });

  it("Should returns 359°", () => {
    expect(AnglesUtils.calculateAngle(100, -1).toFixed(0)).toBe("359");
  });
});
