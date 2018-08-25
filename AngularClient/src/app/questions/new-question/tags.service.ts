import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../../shared/errorhandler';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) { }

  getTags(): Observable<any> {
    return this.http
      .get<any>(`/api/tags`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(catchError(handleError));
  }
}
