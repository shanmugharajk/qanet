import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { QuestionsListComponent } from './questions/questions-list/questions-list.component';
import { QuestionComponent } from './questions/questions-list/question/question.component';
import { SigninComponent } from './auth/signin.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewQuestionComponent } from './questions/new-question/new-question.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ErrorMessageComponent } from './messages/error-message/error-message.component';
import { QuestionAnswerDetailComponent } from './questions/question-answer-detail/question-answer-detail.component';
import { VoteComponent } from './questions/question-answer-detail/vote/vote.component';
import { PostUserDetailComponent } from './post-user-detail/post-user-detail.component';
import { CommentsComponent } from './questions/question-answer-detail/comments/comments.component';
import { NewCommentComponent } from './questions/question-answer-detail/comments/new-comment/new-comment.component';
import { CommentComponent } from './questions/question-answer-detail/comments/comment/comment.component';
import { NewAnswerComponent } from './questions/question-answer-detail/new-answer/new-answer.component';
import { PromptLoginModalComponentComponent } from './messages/prompt-login-modal-component/prompt-login-modal-component.component';
import { AppComponent } from './app.component';
import { AnswersComponent } from './questions/question-answer-detail/answers/answers.component';
import { AnswerComponent } from './questions/question-answer-detail/answers/answer/answer.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionsListComponent,
    QuestionComponent,
    SigninComponent,
    NotFoundComponent,
    NewQuestionComponent,
    SignupComponent,
    ErrorMessageComponent,
    QuestionAnswerDetailComponent,
    VoteComponent,
    PostUserDetailComponent,
    CommentsComponent,
    NewCommentComponent,
    CommentComponent,
    NewAnswerComponent,
    PromptLoginModalComponentComponent,
    AnswersComponent,
    AnswerComponent,
    LoaderComponent
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
