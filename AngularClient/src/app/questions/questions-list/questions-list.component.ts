import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../posts.service';
import { QuestionsList } from './questions-list.model';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  questionsList: QuestionsList;
  isLoading: boolean;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute) {
      this.isLoading = true;
    }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          const index = params['index'];
          this.fetchQuestionsList(index || 0);
        }
      );
  }

  fetchQuestionsList(index: number) {
    this.isLoading = true;

    this.postsService
      .getQuestions(index)
      .subscribe(
        (data: QuestionsList) => {
          this.isLoading = false;
          this.questionsList = data;
        },
        error => console.log(error)
      );
  }
}
