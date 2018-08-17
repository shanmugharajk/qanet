import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Comment from '../comment.model';
import { AuthService } from '../../../../auth/auth.service';
import { CommentsService } from '../comments.service';
import { MessageService } from '../../../../messages/message.service';

declare var require: any;
const moment = require('moment');

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() id: number;
  @Input() comment: Comment;
  @Input() showMore: boolean;
  @Input() isQuestion: boolean;

  @Output() deleted = new EventEmitter();

  constructor(
    private authService: AuthService,
    private commentsService: CommentsService,
    private messagingService: MessageService
  ) {}

  ngOnInit() {
  }

  canShowDelete() {
    return this.authService.isAuthenticated() &&
      this.comment.author === this.authService.getUserId();
  }

  onDeleteClick() {
    this.messagingService.hideError();

    const successCb = () => {
      this.deleted.emit();
    };

    const errorCb =  error => {
      console.log(error);
      this.messagingService.notifyError('Error in deleting', error.message);
    };

    if (this.isQuestion === true) {
      this.commentsService.deleteQuestionComment(this.id, this.comment.id)
        .subscribe(successCb, errorCb);
    } else {
      this.commentsService.deleteAnswerComment(this.id, this.comment.id)
        .subscribe(successCb, errorCb);
    }
  }

  getCommentedDate() {
    return moment(this.comment.commentedAt)
    .calendar(null, {
        sameDay: '[Today], h:mm a',
        lastDay: '[Yesterday], h:mm a',
        sameElse: 'dddd, MMMM Do YYYY, h:mm a'
    });
  }
}
