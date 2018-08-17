import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  notificationSubscription: Subscription;
  hideErrorSubscription: Subscription;
  title = 'Message';
  message =  'Got an error!.';
  hide = true;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.notificationSubscription = this.messageService.notifyError$
      .subscribe(({title, message}) => {
        this.hide = false;
        this.message = message;
        this.title = title;
      });

    this.hideErrorSubscription = this.messageService.hideError$
      .subscribe(() => {
        this.hide = true;
      });
  }

  onClose() {
    this.hide = true;
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
    this.hideErrorSubscription.unsubscribe();
  }
}
