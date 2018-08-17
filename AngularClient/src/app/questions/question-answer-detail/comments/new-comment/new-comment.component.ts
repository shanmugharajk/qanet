import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentsService } from '../comments.service';
import { MessageService } from '../../../../messages/message.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.css']
})
export class NewCommentComponent implements OnInit {
  comment: string;
  isValid: boolean;
  showInOrange: boolean;
  helperText: string;

  @Input() hide: boolean;
  @Input() id: number;
  @Input() isQuestion: boolean;

  @Output() saved = new EventEmitter();

  constructor(
    private commentsService: CommentsService,
    private messageService: MessageService) {
      this.clearForm();
    }

  ngOnInit() {
  }

  onCommentChange() {
    const {length} = this.comment;

    this.showInOrange = false;

    if (length === 0) {
      this.helperText = `15 more characters to go`;
    } else if (length < 15) {
      const lengthMoreToGo = 15 - length;
      this.helperText = `${lengthMoreToGo} more characters to go`;
    } else if (length < 250) {
      const lengthLeft = 250 - length;
      this.helperText = `${lengthLeft} more characters left`;
    } else {
      const lengthExcess = length - 250;
      this.helperText = `Excess by ${lengthExcess} more characters to go`;
      this.showInOrange = true;
    }

    this.isValid = true;
  }

  onSubmit() {
    const length = this.comment && this.comment.length || 0;

    if (length < 15 || length > 250) {
      this.isValid = false;
      return;
    }

    this.addComment();
  }

  addComment() {
    this.messageService.hideError();

    const successCb = id => {
      console.log(id);
      this.clearForm();
      this.saved.emit();
    };

    const errorCb = error => {
      console.log(error);
      this.messageService.notifyError('Error in saving', error.message);
    };

    if (this.isQuestion === true) {
      this.commentsService.addQuestionComment(this.id, this.comment)
        .subscribe(successCb, errorCb);
    } else {
      this.commentsService.addAnswerComment(this.id, this.comment)
        .subscribe(successCb, errorCb);
    }
  }

  clearForm() {
    this.comment = '';
    this.isValid = true;
    this.hide = true;
    this.showInOrange = false;
    this.helperText = '15 more characters to go';
  }
}
