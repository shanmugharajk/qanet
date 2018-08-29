import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewQuestionComponent } from './questions/new-question/new-question.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin.component';
import { QuestionAnswerDetailComponent } from './questions/question-answer-detail/question-answer-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { PostsComponent } from './posts/posts.component';
import { NewAnswerComponent } from './questions/question-answer-detail/new-answer/new-answer.component';
import { SearchComponent } from './search/search.component';

const appRoutes: Routes = [
  { path: 'questions', component: HomeComponent },
  { path: 'questions/search', component: SearchComponent },
  { path: '', component: HomeComponent },
  { path: 'user/signup', component: SignupComponent },
  { path: 'user/signin', component: SigninComponent },
  { path: 'questions/ask', component: NewQuestionComponent, canActivate: [AuthGuard]},
  { path: 'questions/:id/edit', component: NewQuestionComponent, canActivate: [AuthGuard]},
  {
    path: 'questions/:questionId/answers/:answerId/edit',
    component: NewAnswerComponent,
    canActivate: [AuthGuard],
    data: {isEdit: true}
  },
  { path: 'questions/:id', component: QuestionAnswerDetailComponent },
  { path: ':userId/profile', component: PostsComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
