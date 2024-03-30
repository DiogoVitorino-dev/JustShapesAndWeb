import {
  CollidableRectangle,
  CollidableCircle,
  collisionDetector,
} from "@/scripts/collision/collisionDetector";

const rectangleMock: Required<CollidableRectangle> = {
  collidable: { enabled: true },
  angle: 0,
  width: 100,
  height: 100,
  x: 200,
  y: 200,
};

const circleMock: Required<CollidableCircle> = {
  collidable: { enabled: true },
  diameter: 100,
  x: 200,
  y: 200,
};

describe("Testing Rectangles (collisionDetector) - Collision scripts tests", () => {
  it.each([
    [
      "Right side",
      { ...rectangleMock, x: rectangleMock.x + rectangleMock.width + 1 },
    ],
    [
      "Left side",
      { ...rectangleMock, x: rectangleMock.x - rectangleMock.width - 1 },
    ],
    [
      "Upper side",
      { ...rectangleMock, y: rectangleMock.y - rectangleMock.height - 1 },
    ],
    [
      "Bottom side",
      { ...rectangleMock, y: rectangleMock.y + rectangleMock.height + 1 },
    ],
  ])(`Rectangle shouldn't collide on the %s`, async (_, object) => {
    const detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeFalsy();
  });

  it.each([
    [
      "Right side",
      { ...rectangleMock, x: rectangleMock.x + rectangleMock.width },
    ],
    [
      "Left side",
      { ...rectangleMock, x: rectangleMock.x - rectangleMock.width },
    ],
    [
      "Upper side",
      { ...rectangleMock, y: rectangleMock.y - rectangleMock.height },
    ],
    [
      "Bottom side",
      { ...rectangleMock, y: rectangleMock.y + rectangleMock.height },
    ],
  ])(`Rectangle should collide on the %s`, async (_, object) => {
    const detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Rectangle should collide using the angles`, async () => {
    let object = rectangleMock;

    object = {
      ...object,
      x: object.x + object.width + 20,
      angle: 0,
    };

    let detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeFalsy();

    object = { ...object, angle: 45 };

    detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Rectangle should collide using the sizes`, async () => {
    let object = rectangleMock;

    object = {
      ...object,
      x: object.x - object.width - 50,
      width: object.width + 49,
    };

    let detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeFalsy();

    object = {
      ...object,
      width: object.width + 50,
    };

    detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Rectangle should collide in circles`, async () => {
    let object = circleMock;

    object = {
      ...object,
      x: object.x + object.diameter + 1,
    };

    let detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeFalsy();

    object = {
      ...object,
      x: object.x - 1,
    };

    detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Rectangle shouldn't collide with ignore property`, async () => {
    let object = rectangleMock;

    object = {
      ...object,
      x: object.x + object.width,
      angle: 0,
    };

    let detector = await collisionDetector([rectangleMock], [object]);
    expect(detector).toBeTruthy();

    object = {
      ...object,
      collidable: { enabled: true, ignore: true },
    };

    detector = await collisionDetector([rectangleMock], [object]);

    expect(detector).toBeFalsy();
  });
});

// Circles
describe("Testing Circles (collisionDetector) - Collision scripts tests", () => {
  it(`Circles shouldn't collide`, async () => {
    const object = { ...circleMock, x: circleMock.x + circleMock.diameter + 1 };

    const detector = await collisionDetector([circleMock], [object]);

    expect(detector).toBeFalsy();
  });

  it(`Circles should collide`, async () => {
    const object = { ...circleMock, x: circleMock.x + circleMock.diameter };

    const detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Circle should collide using the sizes`, async () => {
    let object = circleMock;

    object = {
      ...object,
      x: object.x - object.diameter - 50,
    };
    let detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeFalsy();

    object = {
      ...object,
      diameter: object.diameter + 60,
    };

    detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Circle should collide in rectangle`, async () => {
    let object = rectangleMock;

    object = {
      ...object,
      x: object.x + object.width + 1,
    };
    let detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeFalsy();

    object = {
      ...object,
      x: object.x - 1,
    };

    detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeTruthy();
  });

  it(`Circle shouldn't collide with ignore property`, async () => {
    let object = circleMock;

    object = {
      ...object,
      x: object.x + object.diameter,
    };

    let detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeTruthy();

    object = {
      ...object,
      collidable: { ...object.collidable, ignore: true },
    };

    detector = await collisionDetector([circleMock], [object]);
    expect(detector).toBeFalsy();
  });
});
