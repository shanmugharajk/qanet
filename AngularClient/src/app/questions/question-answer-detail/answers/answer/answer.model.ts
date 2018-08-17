import Comment from '../../comments/comment.model';
import Comments from '../../comments/comments.model';

export interface Answer {
  id: number;
  answer: string;
  comments: Comments;
  votes: number;
  author: string;
  authorPoints: number;
  createdAt: Date;
  updatedAt:  Date;
  isAccepted: boolean;
  selfVoted: boolean;
  selfVote: number;
}
