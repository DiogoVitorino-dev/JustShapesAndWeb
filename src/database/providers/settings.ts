import AsyncStorage from "@react-native-async-storage/async-storage";

import { DatabaseKeys } from "../databaseKeys";

import { Settings } from "@/settings";

const get = async () => {
  const item = await AsyncStorage.getItem(DatabaseKeys.settings);
  return item ? (JSON.parse(item) as Settings) : null;
};

const set = (value: Settings) => {
  const item = JSON.stringify(value);
  return AsyncStorage.setItem(DatabaseKeys.settings, item);
};

const remove = async () => {
  return AsyncStorage.removeItem(DatabaseKeys.settings);
};

export const SettingsDatabaseProvider = {
  get,
  set,
  remove,
};
