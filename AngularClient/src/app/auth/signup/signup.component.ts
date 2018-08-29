import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('signupForm') signupForm: NgForm;

  title: string;
  errorMessage: string;

  hideForm = false;
  isFetching = false;
  isError = true;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  signup() {
    this.errorMessage = '';
    this.isFetching = true;

    const { userId, displayName, password, retypePassword } = this.signupForm.value;

    if (password !== retypePassword) {
      this.isError = true;
      this.isFetching = false;
      this.errorMessage = 'Password and re type password should match';
      return;
    }

    this.authService
      .signUp({userId, displayName, password})
      .subscribe(this.afterSignedUpSuccessfully, this.onErrorInSigningUp);
  }

  afterSignedUpSuccessfully = () => {
    this.signupForm.reset();

    this.hideForm = true;
    this.isFetching = false;
    this.title = 'Signed up Successfully!';
    this.isError = false;
    this.errorMessage = 'Please click signin and signin to your new account';
  }

  onErrorInSigningUp = (error: any) => {
    this.isFetching = false;
    this.isError = true;
    this.title = 'Error in Signup';
    this.errorMessage = error;
  }

  onChange() {
    this.errorMessage = '';
  }
}
