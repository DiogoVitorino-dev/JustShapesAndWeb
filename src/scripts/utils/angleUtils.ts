function shiftAngle(angle: number, amount: number) {
  if (angle === 0) return 0;
  return (angle + amount) % 360;
}

function calculateAngle(x: number, y: number) {
  let angle = Math.atan2(y, x); // calculating angle
  angle = angle * (180 / Math.PI); // convert radian to degree
  angle = shiftAngle(angle, 360); // convert to positives degrees

  return angle;
}

export const AnglesUtils = {
  shiftAngle,
  calculateAngle,
};
