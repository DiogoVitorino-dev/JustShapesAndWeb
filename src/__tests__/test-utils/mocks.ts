// Mock async storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock measure (Reanimated)
jest.mock("react-native-reanimated", () => {
  const originalModule = jest.requireActual("react-native-reanimated");

  return {
    __esModule: true,
    ...originalModule,
    measure: () => ({
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      pageX: 100,
      pageY: 100,
    }),
  };
});

// Fixed random
beforeEach(() => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.8);
});

afterEach(() => {
  jest.spyOn(global.Math, "random").mockRestore();
});
