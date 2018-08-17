import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const handleError = (error: HttpErrorResponse) => {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(error);
  }

  if (error.status === 401) {
    return throwError('Please login/signup to do this operation');
  }

  // return an observable with a user-facing error message
  if (error.error.message) {
    return throwError(error.error.message);
  } else {
    return throwError('Something went wrong. Please try after sometime.');
  }
};
