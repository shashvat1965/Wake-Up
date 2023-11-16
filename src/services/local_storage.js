import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export class StorageService {
  static setLocal(key, value) {
    storage.set(key, value);
  }

  static getLocal(key) {
    return storage.getString(key);
  }

  static deleteLocal(key) {
    storage.delete(key);
  }

  static clearLocal() {
    storage.clearAll();
  }
}
