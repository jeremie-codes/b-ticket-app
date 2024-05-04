import AsyncStorage from "@react-native-async-storage/async-storage";

const setItem = async (item: string, value: string) =>
  await AsyncStorage.setItem(item, value);

const getItem = async (item: string) => await AsyncStorage.getItem(item);

const removeItem = async (item: string) => await AsyncStorage.removeItem(item);

const clearAll = async () => await AsyncStorage.clear();

export const AppLocalStorage = {
  setItem,
  getItem,
  removeItem,
  clearAll,
};
