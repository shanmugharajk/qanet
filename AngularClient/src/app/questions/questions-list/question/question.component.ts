import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../question.model';

declare var require: any;
const moment = require('moment');

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getAnswersCssClass() {
    if (this.question.hasAcceptedAnswer) {
      return 'answer-accepted';
    }
    if (this.question.totalAnswers > 0) {
      return 'has-answers';
    }
  }

  getAskedTime() {
    return moment(this.question.createdAt)
      .calendar(null, {
          sameDay: '[Today], h:mm a',
          lastDay: '[Yesterday], h:mm a',
          sameElse: 'dddd, MMMM Do YYYY, h:mm a'
      });
  }

  onQuestionLinkClick(event: any, id: number) {
    event.preventDefault();
    this.router.navigate(['/questions', id], {queryParams: {pageNo: 1}});
  }
}
