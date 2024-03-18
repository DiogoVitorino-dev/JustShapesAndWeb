import { Angle, Position } from "@/constants/commonTypes";

function convertToRadian(angle: Angle) {
  "worklet";
  return angle * (Math.PI / 180);
}

function getDistanceFromAngle(angle: Angle, radius: number, origin?: Position) {
  "worklet";
  let x = 0;
  let y = 0;

  angle = convertToRadian(angle);

  x = radius * Math.cos(angle);
  y = radius * Math.sin(angle);

  if (origin) {
    return {
      x: origin.x + x,
      y: origin.y + y,
    };
  }
  return { x, y };
}

function shiftAngle(angle: Angle, amount: number) {
  "worklet";
  if (angle === 0) return 0;
  return (angle + amount) % 360;
}

function getAngleFromPosition(x: number, y: number) {
  "worklet";
  let angle = Math.atan2(y, x); // calculating angle
  angle = angle * (180 / Math.PI); // convert radian to degree
  angle = shiftAngle(angle, 360); // convert to positives degrees

  return Number(angle.toFixed(0));
}

export const AnglesUtils = {
  shiftAngle,
  getAngleFromPosition,
  getDistanceFromAngle,
};
