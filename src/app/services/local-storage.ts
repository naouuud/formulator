import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private get storage(): Storage | null {
    if (!this.isBrowser) return null;

    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    const storage = this.storage;
    if (!storage) return;

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`LocalStorage set failed for key "${key}"`, err);
    }
  }

  get<T>(key: string): T | null {
    const storage = this.storage;
    if (!storage) return null;

    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.warn(`LocalStorage get failed for key "${key}"`, err);
      return null;
    }
  }

  remove(key: string): void {
    const storage = this.storage;
    if (!storage) return;

    try {
      storage.removeItem(key);
    } catch (err) {
      console.warn(`LocalStorage remove failed for key "${key}"`, err);
    }
  }

  clear(): void {
    const storage = this.storage;
    if (!storage) return;

    try {
      storage.clear();
    } catch (err) {
      console.warn('LocalStorage clear failed', err);
    }
  }

  has(key: string): boolean {
    const storage = this.storage;
    if (!storage) return false;

    return storage.getItem(key) !== null;
  }
}
