import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../messages/message.service';

declare var $: any;

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit, AfterViewInit {
  subscription: Subscription;

  @Input() id: string;
  @Input() headerText: string;
  @Input() mainContent: string;
  @Input() yesText: string;
  @Input() cancelText: string;

  @Output() yesClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscription = this.messageService.promptYesNoModal$
    .subscribe((res: { show: boolean; id: string; }) => {
      if (res.show === false) {
        $(`#${res.id}`).modal('hide', {detachable: false});
        $(`#${res.id}`).remove();
      } else {
        $(`#${res.id}`).modal('show', {detachable: false});
      }
    });
  }

  onYesClick() {
    this.yesClick.emit();
  }

  onCancelClick() {
    this.cancelClick.emit();
  }
}
