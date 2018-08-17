import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { QuestionsList } from './questions-list/questions-list.model';
import { Observable, Subject } from 'rxjs';
import { handleError } from '../shared/errorhandler';
import { NewQuestion } from './new-question/new-question.model';
import { Question } from './questions-list/question.model';
import { AnswersList } from './question-answer-detail/answers/answers-list.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  notifyAnswerAdded$ = new Subject();

  constructor(private http: HttpClient) {}

  public getQuestions(index: number = 0): Observable<QuestionsList> {
    return this.http
      .get<QuestionsList>(`/api/questions?index=${index}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }

  public getQuestionDetail(id: number): Observable<Question> {
    return this.http
      .get<Question>(`/api/questions/${id}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }

  public createNewQuestion(newQuestion: NewQuestion): Observable<{id: number}> {
    return this.http
      .post<NewQuestion>('/api/questions', newQuestion, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public postAnswer(questionId: number, answer: string): Observable<{id: number}> {
    return this.http
      .post<string>(`/api/questions/${questionId}/answers`, {answer}, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public fetchAnswers(questionId: number, pageNo: number = 0): Observable<AnswersList> {
    return this.http
      .get(`/api/questions/${questionId}/answers?index=${pageNo}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<AnswersList>(catchError(handleError));
  }

  public notifyAnswerAdded(): void {
    this.notifyAnswerAdded$.next();
  }
}
