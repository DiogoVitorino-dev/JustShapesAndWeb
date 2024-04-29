import "@testing-library/react-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

require("react-native-reanimated").setUpTests();

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("./src/scripts/movement/useMovementSystem.ts", () => ({
  useMovementSystem: (targets) => ({ MovementResult: targets }),
}));

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
