import { Component, OnInit, Input } from '@angular/core';

declare var require: any;
const moment = require('moment');

@Component({
  selector: 'app-post-user-detail',
  templateUrl: './post-user-detail.component.html',
  styleUrls: ['./post-user-detail.component.css']
})
export class PostUserDetailComponent implements OnInit {
  @Input() createdAt: any;
  @Input() author: any;
  @Input() authorPoints: any;
  @Input() isQuestion: boolean;

  constructor() { }

  ngOnInit() {
  }

  getTimeText() {
    return this.isQuestion === true ?
      `Asked at ${this.getAskedTime()}` :
      `Answered at ${this.getAskedTime()}`;
  }

  getAskedTime() {
    return moment(this.createdAt)
      .calendar(null, {
          sameDay: '[Today], h:mm a',
          lastDay: '[Yesterday], h:mm a',
          sameElse: 'dddd, MMMM Do YYYY, h:mm a'
      });
  }
}
