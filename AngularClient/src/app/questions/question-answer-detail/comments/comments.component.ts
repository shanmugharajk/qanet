import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommentsService } from './comments.service';
import Comment from './comment.model';
import { MessageService } from '../../../messages/message.service';
import { AuthService } from '../../../auth/auth.service';
import Comments from './comments.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  hideActionsSection: boolean;
  showMoreComments: boolean;

  @Input() comments: Comments;
  @Input() isQuestion: boolean;
  @Input() id: number;

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.hideActionsSection = false;
    this.showMoreComments = false;
  }

  ngOnInit() {
    this.showMoreComments = this.comments.hasNext;
  }

  ngOnDestroy(): void {
    this.messageService.promptLoginModal(false);
    this.messageService.clearError();
  }

  onAddCommentClick() {
    if (this.authService.isAuthenticated() === true) {
      this.hideActionsSection = !this.hideActionsSection;
    } else {
      this.messageService.promptLoginModal(true);
    }
  }

  onShowMoreClick() {
    this.messageService.clearError();
    this.showMoreComments = !this.showMoreComments;
    this.fetchAllComments();
  }

  onCommentDeleted() {
    this.messageService.clearError();
    this.fetchAllComments();
  }

  onNewCommentSaved() {
    this.messageService.clearError();
    this.hideActionsSection = !this.hideActionsSection;
    this.fetchAllComments();
  }

  fetchAllComments() {
    if (this.isQuestion === true) {
      this.fetchAllQuestionComments();
    } else {
      this.fetchAllAnswerComments();
    }
  }

  fetchAllAnswerComments() {
    this.commentsService.getAnswerComments(this.id)
      .subscribe(
        comments => this.comments = comments,
        error => this.messageService.notifyError('Error in fetching comments', error.message));
  }

  fetchAllQuestionComments() {
    this.commentsService.getQuestionComments(this.id)
      .subscribe(
        comments => this.comments = comments,
        error => this.messageService.notifyError('Error in fetching comments', error.message));
  }
}
