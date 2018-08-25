import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { MessageService } from '../../messages/message.service';
import { PostsService } from '../posts.service';
import { NewQuestion } from './new-question.model';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Question } from '../questions-list/question.model';
import { TagsService } from './tags.service';

declare var $: any;
declare var require: any;
const Quill = require('quill');

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit, OnDestroy {
  quillEditor: any;
  onEditorTextChange: any;
  onSelectionChange: any;
  title: any;

  // List of all tags to load.
  tagsList: Array<string>;
  isFetching = false;

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

  // Quill editor.
  @ViewChild('editor') editor: ElementRef;

  // List of user selected tags.
  @ViewChild('tags') tags: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private postsService: PostsService,
    private tagsService: TagsService) {}

  // Life cycle events
  ngOnInit(): void {
    this.initializeTags();
    this.loadTags();
    this.initializeQuilEditor();
    this.initializeQuilEditorEvents();
  }

  ngOnDestroy() {
    if (this.onEditorTextChange) {
      this.onEditorTextChange.removeListener('text-change');
    }
    if (this.onSelectionChange) {
      this.onSelectionChange.removeListener('selection-change');
    }
    this.messageService.clearError();
  }

  // Initiliazation
  initializeTags() {
    // TODO Remove the jquery setup to initialize.
    $('#tags').dropdown({
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

  // Creates the editor instance.
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

  // Attach editor events.
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

  // Calls the api and loads the tags.
  loadTags() {
    this.isFetching = true;

    this.tagsService.getTags()
      .subscribe(tags => {
        this.tagsList = tags;
        // This should be here so that the elements need to bind in case of edit will be available
        // this point.
        this.loadData();
      },
      error => {
        this.messageService.notifyError('Error in loading', error);
        this.isFetching = false;
      });
  }

  // Loading title, question.
  loadData() {
    const id = +this.activatedRoute.snapshot.params['id'];

    if (isNaN(id) === true) {
      this.isFetching = false;
      return;
    }

    const { questionToEdit } = this.postsService;

    if (!questionToEdit || id !== questionToEdit.id) {
      this.postsService.getQuestionDetail(id)
        .subscribe(
          this.afterQuestionFetched,
          error => this.onApiError('Error in fetching', error));
    } else {
     this.afterQuestionFetched(questionToEdit);
    }
  }

  afterQuestionFetched(question: Question) {
    this.isFetching = false;

    const selectedTagsString = question.tags.join(',');

    setTimeout(() => {
      $('#tags').dropdown('set exactly', selectedTagsString.split(','));
      this.quillEditor.setContents(JSON.parse(question.question));
      this.title = question.title;
    });
  }

  // Save the question.
  onSaveClick() {
    this.messageService.clearError();

    if (this.hasErrors() === true) {
      this.messageService
        .notifyError('Error in saving form', 'Please fill all the fields marked as madatory.');
      return;
    }

    const post = this.getDataToUpdate();

    const { questionToEdit } = this.postsService;

    if (!questionToEdit) {
      this.postsService.addNewQuestion(post)
        .subscribe(
          (res: {id: number}) => this.afterQuestionSaved(res.id),
          error => this.onApiError('Error in saving form', error));
    } else {
      this.postsService.updateQuestion(post, questionToEdit.id)
        .subscribe(
          () => this.afterQuestionSaved(questionToEdit.id),
          error => this.onApiError('Error in saving form', error));
    }
  }

  getDataToUpdate(): NewQuestion {
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

    return post;
  }

  afterQuestionSaved(questionId: number) {
    this.clearForm();
    this.router.navigate(['/questions', questionId]);
  }

  onApiError(title: string, error: any) {
    this.messageService.notifyError(title, error);
    this.isFetching = false;
  }

  hasErrors() {
    if (!this.title) {
      this.errors.title = true;
      return true;
    }

    if (!this.tags.nativeElement.defaultValue) {
      this.errors.tags = true;
      return true;
    }

    const text = this.quillEditor.getText() || '';

    if (text.length < 100) {
      this.errors.question = true;
      return true;
    }

    return false;
  }

  clearForm() {
    this.quillEditor.setContents([]);
    this.title = '';
    // TODO Remove this jquery way of clearing.
    $('#tags').dropdown('clear');
  }

  // Title textbox - change/blur for making the red border when validatiob fails.
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
}
