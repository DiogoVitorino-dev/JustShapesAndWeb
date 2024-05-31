import { MathUtils } from "@/utils/mathUtils";

describe("Testing random - Math Utils tests", () => {
  it("Should generate a random number between min and max", () => {
    jest.spyOn(global.Math, "random").mockRestore();

    const { random } = MathUtils;
    let tests = 10000;
    let generated: number;

    while (tests > 0) {
      generated = random(-5, 5);

      expect(generated).toBeDefined();
      expect(generated).toBeGreaterThanOrEqual(-5);
      expect(generated).toBeLessThanOrEqual(5);

      tests -= 1;
    }
  });
});

describe("Testing interpolate - Math Utils tests", () => {
  it("Should interpolate a value between the minimum and maximum range", () => {
    const { interpolate } = MathUtils;
    const test_1 = interpolate(20, { min: 0, max: 100 }, { min: 0, max: 1 });
    expect(test_1).toBe(0.2);
  });
});

describe("Testing percentage - Math Utils tests", () => {
  it("Should calculate the percentage correctly", () => {
    const { percentage } = MathUtils;
    expect(percentage(50, 100)).toBe(50);
    expect(percentage(20, 100)).toBe(20);
  });
});
