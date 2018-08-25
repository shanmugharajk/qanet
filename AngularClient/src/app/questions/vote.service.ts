import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
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
      .pipe<number>(catchError(handleError));
  }

  // Answer
  public upvoteAnswer(answerId: number, vote: number) {
    return this.http
    .post<{}>(`/api/answers/${answerId}/vote/${vote}`, {} , {
      observe: 'body'
    })
    .pipe<number>(catchError(handleError));
  }

  public acceptAnswer(questionId: number, answerId: number) {
    return this.http
    .post<{}>(`/api/questions/${questionId}/answers/${answerId}/accept`, {} , {
      observe: 'body'
    })
    .pipe(catchError(handleError));
  }

  public AddToBookmark(questionId: number) {
    return this.http.
      post<{}>(`/api/bookmarks/${questionId}`, {}, {
        observe: 'body'
      })
      .pipe<any>(catchError(handleError));
  }

  public DeleteBookmark(questionId: number) {
    return this.http.
      delete(`/api/bookmarks/${questionId}`)
      .pipe<any>(catchError(handleError));
  }

  public notifyUserVoted() {
    this.notifyUserVoted$.next();
  }

  public notifyAnswerAccepted(answerId) {
    this.notifyAnswerAccepted$.next(answerId);
  }
}
