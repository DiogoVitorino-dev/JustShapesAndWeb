/**
 * @jest-environment jsdom
 */
import { act, render as rendering } from "@testing-library/react-native";
import { Provider } from "react-redux";

import WebControl, { KeyboardData } from "@/controllers/web";
import { store } from "@/store";

const defaultKeys = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  jump: " ",
};

const render: typeof rendering = (ui, options) =>
  rendering(<Provider store={store}>{ui}</Provider>, options);

describe("press and release default keys - Web control tests", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // Test Y
  it("Should change the Y value when pressing and releasing the UP key", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.up });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.up });
    await act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the Y value when pressing and releasing the DOWN key", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.down });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.down });
    await act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  // Test X
  it("Should change the X value when pressing and releasing the LEFT key", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.x);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.left });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.left });
    await act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the X value when pressing and releasing the RIGHT key", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.x);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.right });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(100);

    event = new KeyboardEvent("keyup", { key: defaultKeys.right });
    await act(() => {
      window.dispatchEvent(event);
    });

    expect(mockHandlerMove).toHaveReturnedWith(0);
    expect(mockHandlerMove).toHaveReturnedTimes(2);
  });

  it("Should change the value when pressing the uppercase key.", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.y);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    const event = new KeyboardEvent("keydown", {
      key: defaultKeys.up.toUpperCase(),
    });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(-100);
  });

  it("Should change the value when pressing and releasing the JUMP key", async () => {
    const mockHandlerMove = jest.fn((data: KeyboardData) => data.jumping);
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    let event = new KeyboardEvent("keydown", { key: defaultKeys.jump });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(20);

    expect(mockHandlerMove).toHaveReturnedWith(true);

    event = new KeyboardEvent("keyup", { key: defaultKeys.jump });
    await act(() => {
      window.dispatchEvent(event);
    });

    jest.advanceTimersByTime(20);

    expect(mockHandlerMove).toHaveReturnedWith(false);
  });
});

describe("Angles - Web control tests", () => {
  const mockHandlerMove = jest.fn((data: KeyboardData) => data.angle);

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    mockHandlerMove.mockClear();
    jest.useRealTimers();
  });

  // Initial point (0°) - Right edge
  // Clockwise

  // Angle 45° - DOWN RIGHT
  it("Should have 45° degrees when pressing DOWN and RIGHT key", async () => {
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.down });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.right });

    await act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(45);
  });

  // Angle 135° - DOWN LEFT
  it("Should have 135° degrees when pressing DOWN and LEFT key", async () => {
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.down });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.left });

    await act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(135);
  });

  // Angle 225° - UP LEFT
  it("Should have 225° degrees when pressing UP and LEFT key", async () => {
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.up });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.left });

    await act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(225);
  });

  // Angle 315° - UP RIGHT
  it("Should have 315° degrees when pressing UP and RIGHT key", async () => {
    render(<WebControl velocity={100} onMove={mockHandlerMove} />);

    const event1 = new KeyboardEvent("keydown", { key: defaultKeys.up });
    const event2 = new KeyboardEvent("keydown", { key: defaultKeys.right });

    await act(() => {
      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
    });

    jest.advanceTimersByTime(500);

    expect(mockHandlerMove).toHaveReturnedWith(315);
  });
});
