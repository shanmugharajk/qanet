import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewQuestionComponent } from './questions/new-question/new-question.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin.component';
import { QuestionAnswerDetailComponent } from './questions/question-answer-detail/question-answer-detail.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'questions/ask', component: NewQuestionComponent, canActivate: [AuthGuard]},
  { path: 'questions/:id', component: QuestionAnswerDetailComponent },
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
