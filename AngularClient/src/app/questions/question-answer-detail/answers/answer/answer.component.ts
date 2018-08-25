import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Answer } from './answer.model';
import { MessageService } from '../../../../messages/message.service';
import { AuthService } from '../../../../auth/auth.service';
import { VoteService } from '../../../vote.service';
import { PostsService } from '../../../posts.service';

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
export class AnswerComponent implements OnInit, OnDestroy {
  isFetching: boolean;
  quillEditor: any;
  isOwner: boolean;
  showThreeDotLoader: boolean;

  @Input() answer: Answer;
  @Input() questionId: number;

  @Output() deleteAnswer = new EventEmitter<number>();

  @ViewChild('answerEditor') answerEditor: ElementRef;

  constructor(
    private voteService: VoteService,
    private postsService: PostsService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isOwner = this.authService.getUserId() === this.answer.author;
    this.subscribeToNotifyAnswerAccepted();
    this.initializeQuilEditor();
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  // Subscriptions
  subscribeToNotifyAnswerAccepted() {
    // This is to undo the previous accepted answer.
    this.voteService.notifyAnswerAccepted$
      .subscribe((answerId: number) => {
        if (this.answer.id !== answerId) {
          this.answer.isAccepted = false;
        }
      });
  }

  // Initializations
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

  // Menu actions
  // Answer DEL
  onDeleteAnswer() {
    this.deleteAnswer.emit(this.answer.id);
  }

  // Answer EDIT
  onEditAnswer() {
    this.postsService.answerToEdit = this.answer;
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
    this.messageService.clearError();

    this.showThreeDotLoader = true;

    const afterAnswerAccepted = () => {
      this.answer.isAccepted = !this.answer.isAccepted;
      this.voteService.notifyAnswerAccepted(this.answer.id);
      this.hideMiniLoader();
    };

    const onErrorInAcceptingAnswer = error => {
      this.messageService.notifyError('Error in updation', error);
      this.hideMiniLoader();
    };

    this.voteService
      .acceptAnswer(this.questionId, this.answer.id)
      .subscribe(afterAnswerAccepted, onErrorInAcceptingAnswer);
  }

  vote(vote: number) {
    // Block the user if he tries to vote the same vote again before
    // the previous request sent to server and get the response.
    if (this.showThreeDotLoader === true) {
      return;
    }

    this.messageService.clearError();
    this.showThreeDotLoader = true;

    const afterVoteUpdated = newVote => {
      this.answer.votes = newVote;
      this.answer.selfVoted = true;
      this.answer.selfVote = vote;
      this.hideMiniLoader();
    };

    const onErrorInUpdatingVote = error => {
      this.messageService.notifyError('Error in voting', error);
      this.hideMiniLoader();
    };

    this.voteService
      .upvoteAnswer(this.answer.id, vote)
      .subscribe(afterVoteUpdated, onErrorInUpdatingVote);
  }

  hideMiniLoader() {
    setTimeout(() => {
      this.showThreeDotLoader = false;
    }, 200);
  }
}
