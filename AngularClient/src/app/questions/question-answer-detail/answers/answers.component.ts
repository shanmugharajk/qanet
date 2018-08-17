import { Component, OnInit, Input } from '@angular/core';
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
export class AnswersComponent implements OnInit {
  answers: AnswersList;
  currentPageNo: (number | any);
  isLoading: boolean;

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
      // console.log(routeParams.id, routeParams.pageNo);
      this.currentPageNo = routeParams.pageNo;
      this.fetchAnswers(this.currentPageNo);
    });

    this.postsService.notifyAnswerAdded$.
      subscribe(() => this.fetchAnswers());
  }

  onPreviousClick() {
    this.router.navigate(['/questions', this.questionId], {
      queryParams: { pageNo: this.answers.index - 1 }
    });
  }

  onNextClick() {
    this.router.navigate(['/questions', this.questionId], {
      queryParams: { pageNo: this.answers.index + 1 }
    });
  }

  fetchAnswers(pageNo: number = 0) {
    this.isLoading = true;
    this.messageService.hideError();

    const errorCb = error => {
      console.log(error);
      this.messageService.notifyError(
        'Error in fetching',
        'Unable to fetch answers at the moment. Please try again later'
      );
    };

    const successCb = (answers: AnswersList) => {
      this.answers = answers;
    };

    const done = () => {
      this.isLoading = false;
    };

    this.postsService
      .fetchAnswers(this.questionId, pageNo)
      .subscribe(successCb, errorCb, done);
  }

  title() {
    const count = this.answers.count;
    return count === 1 ? `${count} Answer` : `${count} Answers`;
  }
}
