import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { QuestionsList } from './questions-list/questions-list.model';
import { Observable, Subject } from 'rxjs';
import { handleError } from '../shared/errorhandler';
import { NewQuestion } from './new-question/new-question.model';
import { Question } from './questions-list/question.model';
import { AnswersList } from './question-answer-detail/answers/answers-list.model';
import { Answer } from './question-answer-detail/answers/answer/answer.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  notifyAnswerAdded$ = new Subject();
  questionToEdit: Question;
  answerToEdit: Answer;

  constructor(private http: HttpClient) {}

  public getQuestions(index: number = 0): Observable<QuestionsList> {
    return this.http
      .get<QuestionsList>(`/api/questions?index=${index}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }

  public searchQuestions(index: number = 0, searchText: string): Observable<QuestionsList> {
    return this.http
    .get(`/api/questions/search?q=${searchText}&index=${index}`, {
      observe: 'body',
      responseType: 'json'
    })
    .pipe<QuestionsList>(catchError(handleError));
  }

  public getQuestionDetail(id: number): Observable<Question> {
    return this.http
      .get<Question>(`/api/questions/${id}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<Question>(catchError(handleError));
  }

  public getAnswerDetail(questionId: number, answerId: number): Observable<Question> {
    return this.http
      .get<Question>(`/api/questions/${questionId}/answers/${answerId}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<Question>(catchError(handleError));
  }

  public addNewQuestion(newQuestion: NewQuestion): Observable<{id: number}> {
    return this.http
      .post<NewQuestion>('/api/questions', newQuestion, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public updateQuestion(question: NewQuestion, questionId: number): Observable<{id: number}> {
    return this.http
      .put<NewQuestion>(`/api/questions/${questionId}`, question, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public deleteQuestion(questionId: number): Observable<any> {
    return this.http
      .delete(`api/questions/${questionId}`)
      .pipe(catchError(handleError));
  }

  public addNewAnswer(questionId: number, answer: string): Observable<{id: number}> {
    return this.http
      .post<string>(`/api/questions/${questionId}/answers`, {answer}, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public updateAnswer(questionId: number, answerId: number, answer: string)
  : Observable<{id: number}> {
    return this.http
      .put<string>(`/api/questions/${questionId}/answers/${answerId}`, {answer}, {
        observe: 'body'
      })
      .pipe<{id: number}>(catchError(handleError));
  }

  public deleteAnswer(questionId: number, answerId: number): Observable<any> {
    return this.http
      .delete(`api/questions/${questionId}/answers/${answerId}`)
      .pipe(catchError(handleError));
  }

  public fetchAnswers(questionId: number, index: number = 0): Observable<AnswersList> {
    return this.http
      .get(`/api/questions/${questionId}/answers?index=${index}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<AnswersList>(catchError(handleError));
  }

  public notifyAnswerAdded(): void {
    this.notifyAnswerAdded$.next();
  }
}
