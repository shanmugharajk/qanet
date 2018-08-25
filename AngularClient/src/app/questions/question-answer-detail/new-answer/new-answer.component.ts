import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';
import { PostsService } from '../../posts.service';
import { MessageService } from '../../../messages/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from '../answers/answer/answer.model';

declare var $: any;
declare var require: any;
const Quill = require('quill');

@Component({
  selector: 'app-new-answer',
  templateUrl: './new-answer.component.html',
  styleUrls: ['./new-answer.component.css']
})
export class NewAnswerComponent implements OnInit, OnDestroy {
  onEditorTextChange: any;
  quillEditor: any;
  showWarning: boolean;
  isFetching: boolean;
  isEdit: boolean;
  title: string;
  saveButtonText: string;

  @Input() questionId: number;

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('message') message: ElementRef;

  constructor(
    private postsService: PostsService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.showWarning = false;
  }

  // Lifecycle events.
  ngOnInit() {
    this.initializeQuilEditor();
    this.loadButtonAndTitleText();
    this.loadData();
  }

  ngOnDestroy() {
    this.messageService.clearError();
  }

  // Initialization
  initializeQuilEditor() {
    const toolbarOptions = [
      'bold',
      'italic',
      'underline',
      'blockquote',
      'code-block'
    ];

    this.quillEditor = new Quill(this.editor.nativeElement, {
      theme: 'snow',
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      languages: ['javascript', 'ruby', 'python']
    });

    this.onEditorTextChange = this.quillEditor.on(
      'text-change',
      (delta: any, oldDelta: any, source: string) => {
        this.showWarning = false;
      }
    );
  }

  loadData() {
    if (this.isEdit === false) {
      return;
    }

    this.questionId = +this.activatedRoute.snapshot.params['questionId'];
    const answerId = +this.activatedRoute.snapshot.params['answerId'];

    if (isNaN(this.questionId) === true || isNaN(answerId)) {
      return;
    }

    this.loadAnswer(answerId);
  }

  loadButtonAndTitleText() {
    this.isEdit = this.activatedRoute.snapshot.data.isEdit || false;

    if (this.isEdit === true) {
      this.saveButtonText = 'Save edits';
      this.title = 'Edit answer';
    } else {
      this.saveButtonText = 'Post your answer';
      this.title = 'Your answer';
    }
  }

  loadAnswer(answerId: number) {
    let { answerToEdit } = this.postsService;

    const afterAnswerFetched = res => {
      answerToEdit = res;
      this.isFetching = false;
      this.quillEditor.setContents(JSON.parse(answerToEdit.answer));
    };

    const onErrorInFetchingAnswer = error => {
      this.messageService.notifyError('Error in fetching', error);
      this.isFetching = false;
    };

    if (!answerToEdit || answerId !== answerToEdit.id) {
      this.postsService
        .getAnswerDetail(this.questionId, answerId)
        .subscribe(afterAnswerFetched, onErrorInFetchingAnswer);
    } else {
      afterAnswerFetched(answerToEdit);
    }
  }

  // Post answer
  updateAnswer() {
    this.messageService.clearError();

    let answer = this.quillEditor.getText() || '';

    if (answer.length < 200) {
      this.showWarning = true;
      this.quillEditor.focus();
      return;
    }

    answer = JSON.stringify(this.quillEditor.getContents());

    if (this.isEdit === true) {
      this.update(answer);
    } else {
      this.addNew(answer);
    }
  }

  update(answer: string) {
    const { answerToEdit } = this.postsService;

    this.postsService.updateAnswer(this.questionId, answerToEdit.id, answer).subscribe(
      (res: { id: number }) => {
        console.log(res);
        this.quillEditor.setContents([]);
        this.router.navigate(['/questions', this.questionId]);
      },
      error => {
        this.messageService.notifyError(
          'Error in posting your answer',
          error.message || 'Please try after sometime'
        );
      }
    );
  }

  addNew(answer: string) {
    this.postsService.addNewAnswer(this.questionId, answer).subscribe(
      (res: { id: number }) => {
        console.log(res);
        this.quillEditor.setContents([]);
        this.postsService.notifyAnswerAdded();
      },
      error => {
        this.messageService.notifyError(
          'Error in posting your answer',
          error.message || 'Please try after sometime'
        );
      }
    );
  }
}
