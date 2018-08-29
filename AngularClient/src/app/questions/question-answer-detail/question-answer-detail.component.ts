import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
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
export class QuestionAnswerDetailComponent implements OnInit, OnDestroy {
  quillEditor: any;
  question: Question;
  isAuthenticated: boolean;
  isOwner: boolean;
  isFetching: boolean;
  showThreeDotLoader: boolean;


  dialogId = 'deleteQuestion';

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
    this.initializeQuilEditor();
    this.loadQuestion();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.messageService.promptYesNoModal(false, this.dialogId);
    this.messageService.promptLoginModal(false);
    this.messageService.clearError();
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
    this.isFetching = true;

    this.postsService.getQuestionDetail(id).subscribe(
      (question: Question) => {
        this.question = question;
        this.isOwner = this.authService.getUserId() === this.question.author;
      },
      error => console.log(error),
      () => {
        setTimeout(() => this.initializeQuilEditor());
        this.isFetching = false;
      }
    );
  }

  // Menus actions
  onDeleteQuestion() {
    if (this.isAuthenticated === false) {
      this.messageService.promptLoginModal(true);
      return;
    }

    this.messageService.clearError();
    this.messageService.promptYesNoModal(true, this.dialogId);
  }

  // Delete question.
  onConfirmDeleteClick() {
    this.isFetching = true;

    this.postsService.deleteQuestion(this.question.id)
      .subscribe(() => {
        this.isFetching = false;
        this.router.navigate(['/questions']);
      },
      error => {
        this.messageService.notifyError('Error in deletion', error);
        this.isFetching = false;
        window.scrollTo(0, 0);
      });
  }

  // Edit question
  onEditQuestion() {
    if (this.isAuthenticated === false) {
      this.messageService.promptLoginModal(true);
      return;
    }

    this.postsService.questionToEdit =  this.question;
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
    if (this.isAuthenticated === false) {
      this.messageService.promptLoginModal(true);
      return;
    }

    this.showThreeDotLoader = true;

    const afterBookmarked = totalBookmarkCount => {
      this.question.totalBookmarks = totalBookmarkCount;
      this.question.selfBookmarked = !this.question.selfBookmarked;
      this.hideThreeDotLoader();
    };

    const onErrorInAddingToBookmark = error => {
      this.messageService.notifyError('Unable to bookmark', error);
      this.hideThreeDotLoader();
    };

   if (this.question.selfBookmarked === true) {
      this.voteService.DeleteBookmark(this.question.id)
      .subscribe(afterBookmarked, onErrorInAddingToBookmark);
   } else {
      this.voteService.AddToBookmark(this.question.id)
      .subscribe(afterBookmarked, onErrorInAddingToBookmark);
   }
  }

  vote(vote: number) {
    if (this.isAuthenticated === false) {
      this.messageService.promptLoginModal(true);
      return;
    }

    // Block the user if he tries to vote the same vote again before
    // the previous request sent to server and get the response.
    if (this.showThreeDotLoader === true) {
      return;
    }

    this.messageService.clearError();
    this.showThreeDotLoader = true;

    const afterVoteAdded = newVote => {
      this.question.votes = newVote;
      this.question.selfVoted = true;
      this.question.selfVote = newVote;
      this.hideThreeDotLoader();
    };

    const onErrorInVoteUpdate = error => {
      this.messageService.notifyError('Unable to do this operation', error);
      this.hideThreeDotLoader();
    };

    this.voteService
      .voteQuestion(this.question.id, vote)
      .subscribe(afterVoteAdded, onErrorInVoteUpdate);
  }

  // Listeners on nofification
  onNewAnswerAdded() {
    this.isFetching = true;
    this.messageService.clearError();

    this.postsService.fetchAnswers(this.question.id).subscribe(
      res => console.log(res),
      error => {
        console.log(error);
        this.messageService.notifyError(
          'Error',
          error.message || 'Error in fetching answers.'
        );
      },
      () => this.isFetching = false
    );
  }

  onLoginPromptClick() {
    this.router.navigate(['/user/signin']);
  }

  hideThreeDotLoader() {
    setTimeout(() => {
      this.showThreeDotLoader = false;
    }, 200);
  }
}
