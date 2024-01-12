/**
 * @jest-environment jsdom
 */

import { act, render } from "@testing-library/react-native";

import Keyboard, { KeyboardData } from "@/controllers/web";

const defaultKeys = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  jump: " ",
};

describe("press and release default keys - Keyboard controller tests", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // Test Y
  it("Should change the Y value when pressing and releasing the UP key", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.up });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.up });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the Y value when pressing and releasing the DOWN key", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.down });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.down });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  // Test X
  it("Should change the X value when pressing and releasing the LEFT key", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.x);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.left });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.left });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the X value when pressing and releasing the RIGHT key", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.x);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.right });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.right });
    act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the value when pressing the uppercase key.", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    const event = new KeyboardEvent("keydown", {
      key: defaultKeys.up.toUpperCase(),
    });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);
  });

  it("Should change the value when pressing and releasing the JUMP key", () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.jumping);
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.jump });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(20);

    expect(mockHandlerMove).toHaveReturnedWith(true);

    event = new KeyboardEvent("keyup", { key: defaultKeys.jump });
    act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(20);

    expect(mockHandlerMove).toHaveReturnedWith(false);
  });
});

describe("Angles - Keyboard controller tests", () => {
  const mockHandlerMove = jest.fn((data: KeyboardData) => data.angle);

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    mockHandlerMove.mockClear();
    jest.useRealTimers();
  });

  // Initial point (0°) - Right edge
  // Clockwise

  // Angle 45° - DOWN RIGHT
  it("Should have 45° degrees when pressing DOWN and RIGHT key", () => {
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.down });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.right });

    act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(45);
  });

  // Angle 135° - DOWN LEFT
  it("Should have 135° degrees when pressing DOWN and LEFT key", () => {
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.down });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.left });

    act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(135);
  });

  // Angle 225° - UP LEFT
  it("Should have 225° degrees when pressing UP and LEFT key", () => {
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.up });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.left });

    act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(225);
  });

  // Angle 315° - UP RIGHT
  it("Should have 315° degrees when pressing UP and RIGHT key", () => {
    render(<Keyboard velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.up });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.right });

    act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(315);
  });
});
