import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    getItem(key: string): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(key);
        }
        return null;
    }

    setItem(key: string, value: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, value);
        }
    }

    removeItem(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }
}
