import AsyncStorage from "@react-native-async-storage/async-storage";

import { DatabaseKeys } from "@/database/databaseKeys";
import { SettingsDatabaseProvider } from "@/database/providers";
import { DefaultSettings } from "@/settings";

const MockSettingsValue = DefaultSettings;

describe("Testing set - Settings Provider Database tests", () => {
  it("Should save settings on database", async () => {
    await SettingsDatabaseProvider.set(MockSettingsValue);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      DatabaseKeys.settings,
      JSON.stringify(MockSettingsValue),
    );
  });
});

describe("Testing remove - Settings Provider Database tests", () => {
  it("Should delete settings on database", async () => {
    await SettingsDatabaseProvider.remove();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(DatabaseKeys.settings);
  });
});

describe("Testing get - Settings Provider Database tests", () => {
  it("Should get settings from database", async () => {
    await SettingsDatabaseProvider.get();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(DatabaseKeys.settings);
  });
});
