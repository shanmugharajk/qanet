import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public saveToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  public deleteToken(): void {
    sessionStorage.removeItem('token');
  }

  public fetchToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  public save(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  public fetch(key: string): string {
    return sessionStorage.getItem(key) || '';
  }

  public delete(key: string): void {
    sessionStorage.removeItem(key);
  }
}
