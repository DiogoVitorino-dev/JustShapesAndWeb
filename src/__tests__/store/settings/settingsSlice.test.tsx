import { DefaultSettings } from "@/settings";
import settingsSlice from "@/store/reducers/settings/settingsSlice";

describe("Testing initial state - Settings Slice tests", () => {
  it("Should return Default Settings in initial state", async () => {
    expect(settingsSlice(undefined, { type: "" }).data).toEqual(
      DefaultSettings,
    );
  });

  it("Shouldn't have initialized state value before initialize ", async () => {
    expect(settingsSlice(undefined, { type: "" }).initialized).not.toBe(true);
  });
});
