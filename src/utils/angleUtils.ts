function shiftAngle(angle: number, amount: number) {
  "worklet";
  if (angle === 0) return 0;
  return (angle + amount) % 360;
}

function calculateAngle(x: number, y: number) {
  "worklet";
  let angle = Math.atan2(y, x); // calculating angle
  angle = angle * (180 / Math.PI); // convert radian to degree
  angle = shiftAngle(angle, 360); // convert to positives degrees

  return Number(angle.toFixed(0));
}

export const AnglesUtils = {
  shiftAngle,
  calculateAngle,
};
