import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  @Input() showBookMark: boolean;
  @Input() bookmarkCount: number;
  @Input() vote: number;
  @Input() selfVoted: boolean;
  @Input() selfVote: number;
  @Input() selfBookmarked: boolean;
  @Input() loading: boolean;
  @Input() isAccepted: boolean;

  @Output() upVote =  new EventEmitter();
  @Output() downVote =  new EventEmitter();
  @Output() bookmark =  new EventEmitter();
  @Output() acceptAnswer =  new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onUpVoteClick() {
    this.upVote.emit();
  }

  onDownVoteClick() {
    this.downVote.emit();
  }

  onBookmarkClick() {
    this.bookmark.emit();
  }

  onAcceptAnswerClick() {
    this.acceptAnswer.emit();
  }
}
