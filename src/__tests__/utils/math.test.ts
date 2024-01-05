import { MathUtils } from "@/scripts/utils/mathUtils";

describe("testing random - Math Utils tests", () => {
  it("Should generate a random number between min and max", () => {
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
