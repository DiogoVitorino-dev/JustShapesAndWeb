import {
  Box,
  Vector,
  Circle,
  Polygon,
  testPolygonPolygon,
  testPolygonCircle,
  testCirclePolygon,
  testCircleCircle,
  Response,
} from "sat";

import { Size, Position } from "@/constants/commonTypes";

// Separating Axis Theorem (SAT) for collision detection
// Voronoi Regions for Circles collision detection

interface SATObject extends Position {}

export interface SATRectangle extends SATObject, Size {
  angle: number;
}

export interface SATCircle extends SATObject {
  diameter: number;
}

export enum SATShapes {
  CIRCLE = "CIRCLE",
  RECTANGLE = "RECTANGLE",
}
export type SATVerifyCircle = (targetData: SATCircle) => SATVerification;
export type SATVerifyRectangle = (targetData: SATRectangle) => SATVerification;

export type SATWithCircle = (objectData: SATCircle) => boolean;
export type SATWithRectangle = (objectData: SATRectangle) => boolean;

export interface SATVerification {
  withRectangle: SATWithRectangle;
  withCircle: SATWithCircle;
}

const verifyRectangle: SATVerifyRectangle = (targetData) => {
  const targetPolygon: Polygon = createPolygonFromBox(targetData);

  const withRectangle: SATWithRectangle = (objectData) => {
    const response = new Response();
    const objectPolygon: Polygon = createPolygonFromBox(objectData);
    return testPolygonPolygon(targetPolygon, objectPolygon, response);
  };

  const withCircle: SATWithCircle = (objectData) => {
    const response = new Response();
    const objectCircle: Circle = createCircle(objectData);

    return testPolygonCircle(targetPolygon, objectCircle, response);
  };

  return { withRectangle, withCircle };
};

const verifyCircle: SATVerifyCircle = (targetData) => {
  const targetCircle: Circle = createCircle(targetData);
  const response = new Response();

  const withRectangle: SATWithRectangle = (objectData) => {
    const objectPolygon: Polygon = createPolygonFromBox(objectData);
    return testCirclePolygon(targetCircle, objectPolygon, response);
  };

  const withCircle: SATWithCircle = (objectData) => {
    const objectCircle: Circle = createCircle(objectData);
    return testCircleCircle(targetCircle, objectCircle, response);
  };

  return { withRectangle, withCircle };
};

const createPolygonFromBox = ({ angle, height, width, x, y }: SATRectangle) => {
  const newPoly = new Box(new Vector(x, y), width, height).toPolygon();

  const center: Position = {
    x: width / 2,
    y: height / 2,
  };

  const rotatePoints = newPoly.points.map((point) => {
    const { x, y } = rotate(angle, { x: point.x, y: point.y }, center);
    point.x = x;
    point.y = y;
    return point;
  });

  newPoly.setPoints(rotatePoints);

  return newPoly;
};

const createCircle = ({ diameter, x, y }: SATCircle) =>
  new Circle(new Vector(x + diameter / 2, y + diameter / 2), diameter / 2);

const rotate = (angle: number, { x, y }: Position, center: Position) => {
  angle = (angle * Math.PI) / 180;

  const sinTheta = Math.sin(angle);
  const cosTheta = Math.cos(angle);

  return {
    x: (x - center.x) * cosTheta - (y - center.y) * sinTheta + center.x,
    y: (x - center.x) * sinTheta + (y - center.y) * cosTheta + center.y,
  };
};

export const SAT = {
  verifyCircle,
  verifyRectangle,
  createPolygonFromBox,
  createCircle,
};
