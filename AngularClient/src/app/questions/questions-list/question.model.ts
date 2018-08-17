export interface Question {
  totalBookmarks: string;
  question: string;
  selfBookmarked: boolean;
  selfVoted: boolean;
  selfVote: number;
  ownQuestion: boolean;
  id: number;
  title: string;
  tags: Array<string>;
  totalAnswers: number;
  hasAcceptedAnswer: boolean;
  votes: number;
  bountyExpiry?: Date;
  author: string;
  authorPoints: number;
  bountyPoints?: number;
  createdAt: Date;
  updatedAt: Date;
}
