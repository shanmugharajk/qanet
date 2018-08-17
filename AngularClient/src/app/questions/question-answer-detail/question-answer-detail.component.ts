import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { PostsService } from '../posts.service';
import { Question } from '../questions-list/question.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from '../../messages/message.service';
import { AuthService } from '../../auth/auth.service';
import { VoteService } from '../vote.service';

declare var require: any;
const Quill = require('quill');

const UpVote = 1;
const DownVote = 2;
const Zero = 0;

@Component({
  selector: 'app-question-answer-detail',
  templateUrl: './question-answer-detail.component.html',
  styleUrls: ['./question-answer-detail.component.css']
})
export class QuestionAnswerDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  quillEditor: any;
  question: Question;
  isAuthenticated: boolean;
  isOwner: boolean;
  isLoading: boolean;
  // TODO Change the variable name :) this is not good.
  isVoteLoading: boolean;

  @ViewChild('questionEditor')
  questionEditor: ElementRef;

  constructor(
    private voteService: VoteService,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  // NG Events
  ngOnInit(): void {
    this.loadQuestion();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngAfterViewInit(): void {
    this.initializeQuilEditor();
  }

  ngOnDestroy(): void {
    this.messageService.promptLoginModal(false);
  }

  loadQuestion() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.fetchQuestion(id);
    });
  }

  // Initialization events
  initializeQuilEditor() {
    if (!this.questionEditor) {
      return;
    }

    this.quillEditor = new Quill(this.questionEditor.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: false
      },
      languages: ['javascript', 'ruby', 'python'],
      readOnly: true
    });

    this.quillEditor.setContents(JSON.parse(this.question.question));
  }

  // Data fetching
  fetchQuestion(id: number) {
    this.isLoading = true;

    this.postsService.getQuestionDetail(id).subscribe(
      (question: Question) => {
        this.question = question;
        this.isOwner = this.authService.getUserId() === this.question.author;
      },
      error => console.log(error),
      () => {
        setTimeout(() => this.initializeQuilEditor());
        this.isLoading = false;
      }
    );
  }

  // VOTE
  onUpVoteClick() {
    if (this.question.selfVote === 1) {
      this.vote(Zero);
    } else {
      this.vote(UpVote);
    }
  }

  onDownVoteClick() {
    if (this.question.selfVote === 2) {
      this.vote(Zero);
    } else {
      this.vote(DownVote);
    }
  }

  onBookmarkClick() {
    //
  }

  vote(vote: number) {
    this.messageService.hideError();
    this.isVoteLoading = true;

    const successCb = newVote => {
      this.question.votes = newVote;
      this.question.selfVoted = true;
      this.question.selfVote = vote;
    };

    const doneCb = () => {
      this.hideMiniLoader();
    };

    const errorCb = error => {
      this.messageService.notifyError('Error in voting', error);
      this.hideMiniLoader();
    };


    this.voteService
      .voteQuestion(this.question.id, vote)
      .subscribe(successCb, errorCb, doneCb);
  }

  // Listeners on nofification
  onNewAnswerAdded() {
    this.isLoading = true;
    this.messageService.hideError();

    this.postsService.fetchAnswers(this.question.id).subscribe(
      res => console.log(res),
      error => {
        console.log(error);
        this.messageService.notifyError(
          'Error',
          error.message || 'Error in fetching answers.'
        );
      },
      () => this.isLoading = false
    );
  }

  onLoginPromptClick() {
    this.router.navigate(['/signin']);
  }

  hideMiniLoader() {
    setTimeout(() => {
      this.isVoteLoading = false;
    }, 500);
  }
}
