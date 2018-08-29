import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MessageService } from './messages/message.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'app';
  isAuthenticated: boolean;
  userId: string;
  searchText: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Required when page refresh happens.
    this.initialize();

    this.authService.notifyLoggedIn$.subscribe(() => {
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
    $('#menu').dropdown();
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  initialize() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();
  }

  onSignOutClick() {
    this.messageService.clearError();

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

  onSearchClick() {
    this.router.navigate([`/questions/search`], {queryParams: {'q': this.searchText}});
    this.searchText = '';
  }

  onPostsClick() {
    this.router.navigate([`/${this.userId}/profile`], {queryParams: {'tab': 'profile-info'}});
  }
}
