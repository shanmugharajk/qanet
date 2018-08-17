import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  NgZone,
  OnDestroy
} from '@angular/core';
import { MessageService } from '../../messages/message.service';
import { PostsService } from '../posts.service';
import { NewQuestion } from './new-question.model';
import { Router } from '../../../../node_modules/@angular/router';

declare var $: any;
declare var require: any;
const Quill = require('quill');

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit, AfterViewInit, OnDestroy {
  quillEditor: any;
  onEditorTextChange: any;
  onSelectionChange: any;
  title: any;

  touched = {
    question : false,
    tags: false,
    title: false
  };

  errors = {
    title: true,
    question: true,
    tags: true
  };

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('tags') tags: ElementRef;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private postsService: PostsService) {}

  ngOnInit(): void {
    this.initializeTags();
  }

  ngAfterViewInit(): void {
    this.initializeQuilEditor();
    this.initializeQuilEditorEvents();
  }

  initializeTags() {
    // TODO Remove the jquery setup to initialize.
    $('.ui.dropdown').dropdown({
      apiSettings: {
        onResponse: function(apiResponse) {
          const results = [];

          for (const key in apiResponse) {
            if (apiResponse.hasOwnProperty(key)) {
              const element = apiResponse[key];
              results.push({
                name: element.id,
                value: element.id,
                text: element.id,
              });
            }
          }
          const response = {
            success: true,
            results
          };

          return response;
        },
        url: 'api/tags'
      },
      onShow: () => {
        this.errors.tags = false;
      },
      onHide: () => {
        this.touched.tags = true;
        const selected = this.tags.nativeElement.defaultValue || '';
        this.errors.tags = selected.length === 0;
      },
      localSearch: false,
      filterRemoteData: true
    });
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
  }

  initializeQuilEditorEvents() {
    const checkError = () => {
      const text = this.quillEditor.getText();
      this.touched.question = false;

      if (text && text.length === 1) {
        this.errors.question = true;
      } else {
        this.errors.question = false;
      }
    };

    this.onEditorTextChange = this.quillEditor.on(
      'text-change',
      (delta: any, oldDelta: any, source: string) => {
        checkError();
      }
    );

    this.onSelectionChange = this.quillEditor.on(
      'selection-change',
      (range: any, oldRange: any, source: string) => {
        checkError();
        this.touched.question = true;
      }
    );
  }

  hasErrors() {
    for (const key in this.errors) {
      if (this.errors[key] === true) {
        return true;
      }
    }

    return false;
  }

  onTitleBlur() {
    this.touched.title = true;

    if (this.title) {
      this.errors.title = false;
    } else {
      this.errors.title = true;
    }
  }

  onTitleChange() {
    if (this.title) {
      this.errors.title = false;
    }
  }

  onSaveClick() {
    this.messageService.hideError();

    if (this.hasErrors() === true) {
      this.messageService.notifyError('Error in saving form', 'Please fill all the fields marked as madatory.');
      return;
    }

    let shortDescription: string = this.quillEditor.getText();
    if (shortDescription.length > 50) {
      shortDescription = shortDescription.substr(0, 50);
    }

    const post: NewQuestion = {
      title:  this.title,
      question: JSON.stringify(this.quillEditor.getContents()),
      shortDescription:  shortDescription,
      tags: this.tags.nativeElement.defaultValue.split(',')
    };

    this.postsService.createNewQuestion(post)
      .subscribe(
        (res: {id: number}) => {
          console.log(res);
          this.clearForm();
          this.router.navigate(['/questions', res.id]);
        },
        error => {
          console.log(error);
          this.clearForm();
        });
  }

  clearForm() {
    this.quillEditor.setContents([]);
    this.title = '';
    // TODO Remove this jquery way of clearing.
    $('.ui.dropdown').dropdown('clear');
  }

  ngOnDestroy() {
    if (this.onEditorTextChange) {
      this.onEditorTextChange.removeListener('text-change');
    }
    if (this.onSelectionChange) {
      this.onSelectionChange.removeListener('selection-change');
    }
  }
}
