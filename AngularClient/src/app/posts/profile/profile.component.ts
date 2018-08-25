import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../users.service';
import { combineLatest } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Profile } from '../../profile.model';
import { MessageService } from '../../messages/message.service';

declare var require: any;
const moment = require('moment');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isFetching: boolean;
  canEdit: boolean;
  showEdit: boolean;
  profile: Profile;
  profileToEdit: Profile;

  constructor(
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Combine them both into a single observable
    const urlParams = combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params, queryParams) => ({ ...params, ...queryParams })
    );
    // Subscribe to the single observable, giving us both
    urlParams.subscribe(routeParams => {
      this.initialize(routeParams);
    });
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  // Initialize
  initialize(routeParams: {[x: string]: any}) {
    this.isFetching = true;
    this.canEdit = this.authService.getUserId() === routeParams.userId;
    this.loadProfile(routeParams.userId);
  }

  getJoinedDate() {
    return moment(this.profile.joinedAt)
      .format('MMMM Do YYYY');
  }

  getAbout() {
    if (this.profile.about) {
      return this.profile.about;
    }

    if (this.authService.getUserId() === this.profile.userId) {
      return '(Your about me is currently blank.)';
    } else {
      return 'Apparently this user keeps his about me blank.';
    }
  }

  loadProfile(userId: string) {
    this.messageService.clearError();

    this.usersService.fetchProfile(userId)
      .subscribe((res: Profile) => {
        this.profile = res;
        this.isFetching = false;
      },
      error => {
        this.isFetching = false;
        this.messageService.notifyError('Error in fetching', error);
      });
  }

  onEditClick() {
    this.profileToEdit = { ...this.profile };
    this.showEdit = true;
  }

  onUpdateProfileClick() {
    this.showEdit = false;
    this.isFetching = true;
    this.messageService.clearError();

    const userId = this.authService.getUserId();

    this.usersService.updateProfile(userId, this.profileToEdit)
      .subscribe(() => {
        this.profile = { ...this.profileToEdit };
        this.profileToEdit = null;
        this.isFetching = false;
      },
      error => {
        this.isFetching = false;
        this.messageService.notifyError('Error in updation', error);
      }
    );
  }
}
