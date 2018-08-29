import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest } from 'rxjs';

import { PostsService } from '../posts.service';
import { QuestionsList } from './questions-list.model';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  questionsList: QuestionsList;
  currentPageNo: number;
  previousPageNo: number;
  nextPageNo: number;
  isFetching: boolean;
  showNoRecords: boolean;

  @Input() isSearch: boolean;

  constructor(
    private messageService: MessageService,
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const urlParams = combineLatest(
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      (params, queryParams) => ({ ...params, ...queryParams })
    );

    urlParams.subscribe((routeParams: Params) => {
      this.questionsList = null;
      this.fetchData(routeParams);
    });
  }

  fetchData(params: Params): any {
    const page = params['page'];
    this.currentPageNo = page || 1;

    if (this.isSearch === true) {
      const search = params['q'];
      this.searchQuestions(this.currentPageNo, search);
    } else {
      this.fetchQuestionsList(this.currentPageNo);
    }

    this.nextPageNo = +this.currentPageNo + 1;
    this.previousPageNo = +this.currentPageNo - 1;
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  searchQuestions(index: number, search: string) {
    this.messageService.clearError();

    if (!search || search.length < 5) {
      this.showNoRecords = false;
      this.messageService.notifyError('Oops!', 'Please enter atleast four characters to search!');
      return;
    }

    this.showNoRecords = true;
    this.isFetching = true;

    this.postsService
      .searchQuestions(index, search)
      .subscribe(
        (data: QuestionsList) => {
          this.isFetching = false;
          this.questionsList = data;
        },
        error => {
          this.messageService.notifyError('Error in fetching', error);
          this.isFetching = false;
        }
      );
  }

  fetchQuestionsList(index: number) {
    this.isFetching = true;

    this.postsService
      .getQuestions(index)
      .subscribe(
        (data: QuestionsList) => {
          this.isFetching = false;
          this.questionsList = data;
        },
        error => {
          this.messageService.notifyError('Error in fetching', error);
          this.isFetching = false;
        }
      );
  }

  onNextClick() {
    this.fetchQuestionsList(++this.currentPageNo);
  }

  onPreviousClick() {
    this.fetchQuestionsList(--this.currentPageNo);
  }
}
