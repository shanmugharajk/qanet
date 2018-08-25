import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { combineLatest } from 'rxjs';
import { PostsService } from '../questions/posts.service';
import { PostsList } from './posts-list.model';
import { MessageService } from '../messages/message.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  isFetching: boolean;
  userId: string;
  selectedTab: string;
  currentPageNo: number;
  posts: any;
  title: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.initRoutingListener();
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  // https://github.com/angular/angular/issues/13804
  // https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/
  // https://www.learnrxjs.io/operators/combination/combinelatest.html
  initRoutingListener() {
    // Combine them both into a single observable
    const urlParams = combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params, queryParams) => ({ ...params, ...queryParams })
    );
    // Subscribe to the single observable, giving us both
    urlParams.subscribe(routeParams => {
      // routeParams containing both the query and route params
      // console.log(routeParams.id, routeParams.page);
      this.currentPageNo = routeParams.page || 1;
      this.selectedTab = routeParams.tab;
      this.userId = routeParams.userId;
      this.fetchData();
    });
  }

  onPreviousClick() {
    this.currentPageNo--;
    const url = `/${this.userId}/profile?tab=${this.selectedTab}&page=${
      this.currentPageNo
    }`;
    this.router.navigateByUrl(url, { preserveFragment: true });
  }

  onNextClick() {
    this.currentPageNo++;
    const url = `/${this.userId}/profile?tab=${this.selectedTab}&page=${
      this.currentPageNo
    }`;
    this.router.navigateByUrl(url, { preserveFragment: true });
  }

  fetchData() {
    // change this to enum or const.
    if (this.selectedTab === 'profile-info') {
      //
    } else if (this.selectedTab === 'questions') {
      this.fetchQuestionsList();
    } else if (this.selectedTab === 'answers') {
      this.fetchAnswersList();
    } else if (this.selectedTab === 'favourites') {
      this.fetchFavourites();
    }
  }

  fetchAnswersList() {
    this.clear();

    this.usersService
      .fetchAnswers(this.userId, this.currentPageNo)
      .subscribe((list: PostsList) =>
        this.onApiSuccessCb(list, 'Answer'), this.onApiErrorCb, this.onApiDoneCb);
  }

  fetchFavourites() {
    this.clear();

    this.usersService
      .fetchFavourites(this.userId, this.currentPageNo)
      .subscribe((list: PostsList) =>
        this.onApiSuccessCb(list, 'Favourite'), this.onApiErrorCb, this.onApiDoneCb);
  }

  fetchQuestionsList() {
    this.clear();

    this.usersService
      .fetchQuestions(this.userId, this.currentPageNo)
      .subscribe((list: PostsList) =>
        this.onApiSuccessCb(list, 'Question'), this.onApiErrorCb, this.onApiDoneCb);
  }

  clear = () => {
    this.posts = null;
    this.title = 'No Records';
    this.messageService.clearError();
    this.isFetching = true;
  }

  onApiErrorCb = (error) => {
    this.messageService.notifyError('Error in fetching', error);
    this.isFetching = false;
  }

  onApiDoneCb = () => {
    this.messageService.clearError();
    this.isFetching = false;
  }

  onApiSuccessCb = (list: PostsList, title: string) => {
    this.posts = list;
    this.isFetching = false;
    this.title =
      list.count === 1 ? `${list.count} ${title}` : `${list.count} ${title}s`;
  }
}
