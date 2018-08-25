import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  notifyError$ = new Subject<{title: string, message: string}>();
  hideError$ = new Subject();

  promptLoginModal$ = new Subject<boolean>();
  promptYesNoModal$ = new Subject<{show: boolean, id: string}>();

  constructor() { }

  notifyError(title: string, message: string) {
    this.notifyError$.next({title, message});
  }

  clearError() {
    this.hideError$.next();
  }

  promptLoginModal(show: boolean) {
    this.promptLoginModal$.next(show);
  }

  promptYesNoModal(show: boolean, id: string) {
    this.promptYesNoModal$.next({show, id});
  }
}
