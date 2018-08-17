import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input
} from '@angular/core';
import { Answer } from './answer.model';
import { MessageService } from '../../../../messages/message.service';
import { AuthService } from '../../../../auth/auth.service';
import { VoteService } from '../../../vote.service';

declare var require: any;
const Quill = require('quill');

const UpVote = 1;
const DownVote = 2;
const Zero = 0;

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit, AfterViewInit {
  quillEditor: any;
  isOwner: boolean;
  isVoteLoading: boolean;

  @Input()
  answer: Answer;
  @Input()
  questionId: number;

  @ViewChild('answerEditor')
  answerEditor: ElementRef;

  constructor(
    private voteService: VoteService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isOwner = this.authService.getUserId() === this.answer.author;

    // This is to undo the previous accepted answer.
    this.voteService.notifyAnswerAccepted$
      .subscribe((answerId: number) => {
        if (this.answer.id !== answerId) {
          this.answer.isAccepted = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.initializeQuilEditor();
  }

  initializeQuilEditor() {
    if (!this.answerEditor) {
      return;
    }

    this.quillEditor = new Quill(this.answerEditor.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: false
      },
      languages: ['javascript', 'ruby', 'python'],
      readOnly: true
    });

    this.quillEditor.setContents(JSON.parse(this.answer.answer));
  }

  // VOTE
  onUpVoteClick() {
    if (this.answer.selfVote === 1) {
      this.vote(Zero);
    } else {
      this.vote(UpVote);
    }
  }

  onDownVoteClick() {
    if (this.answer.selfVote === 2) {
      this.vote(Zero);
    } else {
      this.vote(DownVote);
    }
  }

  onBookmarkClick() {
    console.log('upvoted');
  }

  onAcceptAnswerClick() {
    this.messageService.hideError();

    console.log(this.questionId);

    this.isVoteLoading = true;

    const successCb = () => {
      this.answer.isAccepted = !this.answer.isAccepted;
      this.voteService.notifyAnswerAccepted(this.answer.id);
    };

    const doneCb = () => {
      this.hideMiniLoader();
    };

    const errorCb = error => {
      this.messageService.notifyError('Error in updation', error);
      this.hideMiniLoader();
    };

    this.voteService
      .acceptAnswer(this.questionId, this.answer.id)
      .subscribe(successCb, errorCb, doneCb);
  }

  vote(vote: number) {
    this.messageService.hideError();
    this.isVoteLoading = true;

    const successCb = newVote => {
      this.answer.votes = newVote;
      this.answer.selfVoted = true;
      this.answer.selfVote = vote;
    };

    const doneCb = () => {
      this.hideMiniLoader();
    };

    const errorCb = error => {
      this.messageService.notifyError('Error in voting', error);
      this.hideMiniLoader();
    };

    this.voteService
      .upvoteAnswer(this.answer.id, vote)
      .subscribe(successCb, errorCb, doneCb);
  }

  hideMiniLoader() {
    setTimeout(() => {
      this.isVoteLoading = false;
    }, 500);
  }
}
