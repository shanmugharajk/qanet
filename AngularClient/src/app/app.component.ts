import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MessageService } from './messages/message.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  isAuthenticated: boolean;
  userId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Required when page refresh happens.
    this.initialize();

    this.authService.notifyLoggedIn$.subscribe(() => {
      console.log('after login');
      this.initialize();
       // After landing questions page again user sgined in, then we need this to
      // initialize here. This won't be available at ngOnInit().
      // TODO Do it in a clean way.
      setTimeout(() => {
        $('#menu').dropdown();
      });
    });
  }

  ngAfterViewInit() {
    console.log('init');
    $('#menu').dropdown();
  }

  initialize() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();
  }

  onQaNetClick() {
    this.router.navigate(['']);
  }

  onSignInClick() {
    this.router.navigate(['/signin']);
  }

  onSignOutClick() {
    this.messageService.hideError();

    this.authService.logout()
      .subscribe((response: boolean) => {
        if (response === true) {
          window.location.reload();
        } else {
          this.messageService.notifyError('Error', 'Sorry, we got an error. Unable to signout.');
        }
      },
      error => {
        this.messageService.notifyError('Error', 'Sorry, we got an error. Unable to signout.');
      });
  }

  onAskQuestionClick() {
    // TODO Include auth check.
    this.router.navigate(['/questions/ask']);
  }
}
