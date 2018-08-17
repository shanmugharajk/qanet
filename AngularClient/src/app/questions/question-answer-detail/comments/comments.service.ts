import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import Comment from './comment.model';
import { handleError } from '../../../shared/errorhandler';


@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  public addQuestionComment(questionId: number, comment: string): Observable<any> {
    return this.http
    .post<Comment>(`/api/questions/${questionId}/comments`, {comment: comment}, {
      observe: 'body'
    })
    .pipe<string>(catchError(handleError));
  }

  public addAnswerComment(answerId: number, comment: string): Observable<any> {
    return this.http
    .post<Comment>(`/api/answers/${answerId}/comments`, {comment: comment}, {
      observe: 'body'
    })
    .pipe<string>(catchError(handleError));
  }

  public deleteQuestionComment(questionId: number, commentId: number): Observable<any> {
    return this.http
      .delete(`api/questions/${questionId}/comments/${commentId}`)
      .pipe<string>(catchError(handleError));
  }

  public deleteAnswerComment(questionId: number, commentId: number): Observable<any> {
    return this.http
      .delete(`api/answers/${questionId}/comments/${commentId}`)
      .pipe<string>(catchError(handleError));
  }

  public getQuestionComments(questionId: number): Observable<any> {
    return this.http
      .get<any>(`/api/questions/${questionId}/comments/all`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }

  public getAnswerComments(answerId: number): Observable<any> {
    return this.http
      .get<any>(`/api/answers/${answerId}/comments/all`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }
}
