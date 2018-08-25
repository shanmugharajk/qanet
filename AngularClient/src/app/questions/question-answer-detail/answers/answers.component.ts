import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostsService } from '../../posts.service';
import { AnswersList } from './answers-list.model';
import { MessageService } from '../../../messages/message.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit, OnDestroy {
  answers: AnswersList;
  currentPageNo: (number | any);
  isFetching: boolean;
  answerIdToDelete: number;

  dialogId = 'deleteAnswer';

  @Input() questionId: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private messageService: MessageService
  ) {}

  // https://github.com/angular/angular/issues/13804
  // https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/
  // https://www.learnrxjs.io/operators/combination/combinelatest.html
  ngOnInit() {
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
      this.currentPageNo = routeParams.page;
      this.fetchAnswers(this.currentPageNo);
    });

    this.postsService.notifyAnswerAdded$.
      subscribe(() => this.fetchAnswers());
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  onPreviousClick() {
    this.router.navigate(['/questions', this.questionId], {
      queryParams: { page: this.answers.index - 1 }
    });
  }

  onNextClick() {
    this.router.navigate(['/questions', this.questionId], {
      queryParams: { page: this.answers.index + 1 }
    });
  }

  // GET answers
  fetchAnswers(pageNo: number = 0) {
    this.isFetching = true;
    this.messageService.clearError();

    const onErrorInFetchingAnswers = error => {
      this.messageService.notifyError(
        'Error in fetching',
        'Unable to fetch answers at the moment. Please try again later'
      );
      this.isFetching = false;
    };

    const afterAnswerFetched = (answers: AnswersList) => {
      this.answers = answers;
      this.isFetching = false;
    };

    this.postsService
      .fetchAnswers(this.questionId, pageNo)
      .subscribe(afterAnswerFetched, onErrorInFetchingAnswers);
  }

  title() {
    const count = this.answers.count;
    return count === 1 ? `${count} Answer` : `${count} Answers`;
  }

  // DELETE answer
  deleteAnswer(answerId: number) {
    this.answerIdToDelete = answerId;
    this.messageService.promptYesNoModal(true, this.dialogId);
  }

  onConfirmDeleteClick() {
    this.isFetching = true;

    const doneCb = () => {
      this.isFetching = false;
      this.messageService.promptYesNoModal(false, this.dialogId);
    };

    const afterDeleted = () => {
      this.messageService.clearError();
      // TODO Handle better way than loading the first page.
      this.fetchAnswers();
    };

    const onErrorInDeletion = error => {
      doneCb();
      this.messageService.notifyError('Error in deletion', error);
      window.scrollTo(0, 0);
    };

    this.postsService.deleteAnswer(this.questionId, this.answerIdToDelete)
      .subscribe(afterDeleted, onErrorInDeletion, doneCb);
  }
}
