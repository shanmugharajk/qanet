import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from '../message.service';

declare var $: any;

@Component({
  selector: 'app-prompt-login-modal-component',
  templateUrl: './prompt-login-modal-component.component.html',
  styleUrls: ['./prompt-login-modal-component.component.css']
})
export class PromptLoginModalComponentComponent implements OnInit {
  subscription: Subscription;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.subscription = this.messageService.promptLoginModal$
      .subscribe((show: boolean) => {
        if (show === false) {
          $('#loginPrompt').modal('hide', {detachable: false});
          $('#loginPrompt').remove();
        } else {
          $('#loginPrompt').modal('show', {detachable: false});
        }
      });
  }

  onLoginClick() {
    this.router.navigate(['/signin']);
  }

}
