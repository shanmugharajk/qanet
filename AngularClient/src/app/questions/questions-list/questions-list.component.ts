import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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

  constructor(
    private messageService: MessageService,
    private postsService: PostsService,
    private route: ActivatedRoute) {
      this.isFetching = true;
    }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          const page = params['page'];
          this.currentPageNo = page || 1;
          this.fetchQuestionsList(this.currentPageNo);
          this.nextPageNo = +this.currentPageNo + 1;
          this.previousPageNo = +this.currentPageNo - 1;
        }
      );
  }

  ngOnDestroy() {
    this.messageService.clearError();
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
