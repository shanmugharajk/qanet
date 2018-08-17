import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsService } from '../../posts.service';
import { MessageService } from '../../../messages/message.service';

declare var $: any;
declare var require: any;
const Quill = require('quill');

@Component({
  selector: 'app-new-answer',
  templateUrl: './new-answer.component.html',
  styleUrls: ['./new-answer.component.css']
})
export class NewAnswerComponent implements OnInit, AfterViewInit {
  onEditorTextChange: any;
  quillEditor: any;
  showWarning: boolean;

  @Input() questionId: number;

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('message') message: ElementRef;

  constructor(
    private postsService: PostsService,
    private messageService: MessageService
  ) {
    this.showWarning = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initializeQuilEditor();
  }

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

  onPostAnswerClick() {
    this.messageService.hideError();

    let answer = this.quillEditor.getText() || '';

    if (answer.length < 200) {
      this.showWarning = true;
      this.quillEditor.focus();
      return;
    }

    answer  = JSON.stringify(this.quillEditor.getContents());

    this.postsService.postAnswer(this.questionId, answer)
      .subscribe((res: {id: number}) => {
          console.log(res);
          this.quillEditor.setContents([]);
          this.postsService.notifyAnswerAdded();
        },
        error => {
          this.messageService.notifyError(
            'Error in posting your answer', error.message || 'Please try after sometime');
        });
  }
}
