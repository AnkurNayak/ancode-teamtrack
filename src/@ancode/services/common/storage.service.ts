import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  setItem(key: string, value: any): void {
    if (this._isStorageAvl()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('Failed to create local storage item', err);
      }
    }
  }

  getItem(key: string): any {
    if (this._isStorageAvl()) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error('Failed to get local storage', err);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this._isStorageAvl()) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error('Failed to remove local storage item', err);
      }
    }
  }

  clear(): void {
    if (this._isStorageAvl()) {
      try {
        localStorage.clear();
      } catch (err) {
        console.error('Failed to clear local storage', err);
      }
    }
  }

  private _isStorageAvl(): boolean {
    try {
      if (typeof window === 'undefined' || !isPlatformBrowser(this.platformId)) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
