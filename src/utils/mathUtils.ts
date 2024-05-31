function random(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface InterpolateRange {
  min: number;
  max: number;
}
function interpolate(
  value: number,
  input: InterpolateRange,
  output: InterpolateRange,
) {
  // Ensures the value is within the input range
  value = Math.max(input.min, Math.min(input.max, value));

  let interpolated =
    output.min +
    ((value - input.min) / (input.max - input.min)) * (output.max - output.min);

  // Ensure the interpolated value is within the output range
  interpolated = Math.max(output.min, Math.min(output.max, interpolated));

  return interpolated;
}

const percentage = (percentage: number, of: number) => (percentage / 100) * of;

export const MathUtils = { random, interpolate, percentage };
