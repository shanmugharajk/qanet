import { Injectable } from '@angular/core';
import { PostsList } from './posts/posts-list.model';
import { catchError } from 'rxjs/operators';
import { handleError } from './shared/errorhandler';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profile.model';
import { UpdateProfile } from './update-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  public fetchQuestions(userId: string, pageNo: number = 0) {
    return this.http
      .get(`/api/users/${userId}/questions?index=${pageNo}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<PostsList>(catchError(handleError));
  }

  public fetchAnswers(userId: string, pageNo: number = 0) {
    return this.http
      .get(`/api/users/${userId}/answers?index=${pageNo}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<PostsList>(catchError(handleError));
  }

  public fetchFavourites(userId: string, pageNo: number = 0) {
    return this.http
      .get(`/api/users/${userId}/bookmarks?index=${pageNo}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<PostsList>(catchError(handleError));
  }

  public fetchProfile(userId: string) {
    return this.http
      .get(`/api/users/${userId}/profile`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<Profile>(catchError(handleError));
  }

  public updateProfile(userId: string, updateProfile: UpdateProfile) {
    return this.http
      .put(`/api/users/${userId}/profile`, updateProfile, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe<Profile>(catchError(handleError));
  }
}
