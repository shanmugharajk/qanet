import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { handleError } from '../shared/errorhandler';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  notifyUserVoted$ = new Subject();
  notifyAnswerAccepted$ = new Subject<number>();

  constructor(private http: HttpClient) { }

  // Question
  public voteQuestion(questionId: number, vote: number) {
    return this.http
      .post<{}>(`/api/questions/${questionId}/vote/${vote}`, {} , {
        observe: 'body'
      })
      .pipe<any>(catchError(handleError));
  }

  // Answer
  public upvoteAnswer(answerId: number, vote: number) {
    return this.http
    .post<{}>(`/api/answers/${answerId}/vote/${vote}`, {} , {
      observe: 'body'
    })
    .pipe<any>(catchError(handleError));
  }

  public acceptAnswer(questionId: number, answerId: number) {
    return this.http
    .post<{}>(`/api/questions/${questionId}/answers/${answerId}/accept`, {} , {
      observe: 'body'
    })
    .pipe<any>(catchError(handleError));
  }

  public bookmark(questionId: number) {

  }

  public notifyUserVoted() {
    this.notifyUserVoted$.next();
  }

  public notifyAnswerAccepted(answerId) {
    this.notifyAnswerAccepted$.next(answerId);
  }
}
