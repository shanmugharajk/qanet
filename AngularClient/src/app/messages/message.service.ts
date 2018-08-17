import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  notifyError$ = new Subject<{title: string, message: string}>();
  hideError$ = new Subject();

  promptLoginModal$ = new Subject<boolean>();

  constructor() { }

  notifyError(title: string, message: string) {
    this.notifyError$.next({title, message});
  }

  hideError() {
    this.hideError$.next();
  }

  promptLoginModal(show: boolean) {
    this.promptLoginModal$.next(show);
  }
}
