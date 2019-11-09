import { NextPageContext } from 'next';

export interface IUserInfo {
  userId: string;
  userName: string;
}

export interface ICustomContext extends NextPageContext {
  userInfo: IUserInfo;
  isLoggedIn: boolean;
}

export interface PageContext extends ICustomContext {
  isLoggedIn: boolean;
}

export interface ITag {
  id: string;
  description: string;
}

export interface ICustomAxiosResponse {
  data: any;
  error?: string;
}

export interface IActionBase {
  type: string;
}

export interface IAction<Payload> extends IActionBase {
  payload: Payload;
}

// TODO: Replace any with actual typings.
export interface IQuestionDetails {
  answers: any[];
  questionDetail: IQuestionDetail | any;
}

export interface IComment {
  id: number;
  comments: string;
  questionId: number;
  closeVotes: number;
  isActive: boolean;
  deactivatedBy: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionDetail {
  id: string | number;
  title: string;
  questionContent: string;
  bookmarks: number;
  votes: number;
  closeVotes: number;
  bountyPoints: number;
  bountyExpiryDate: string;
  isActive: boolean;
  isClosed: boolean;
  isReopenRequested: boolean;
  deactivated_by: string;
  createdBy: string;
  updatedBy: string;
  comments: IComment[] | any;
  questionTags: Array<ITag>;
  tags: string;
  hasMoreComments: boolean;
  askedAt: string;
  modifiedAt: string;
  authorPoints: number;
  hasAcceptedAnswer: boolean;
  totalAnswers: number;
  totalBookmarks: number;
  selfVote: number;
  selfBookmarked: boolean;
}

export interface IApiData {
  totalRecords: number;
  totalPage: number;
  nextPage: number;
  prevPage: number;
  pageNum: number;
  recordsPerPage: number;
  cursor: string;
  records: any;
}

export interface IQuestionsApiData extends IApiData {
  records: IQuestionDetail[] | any;
}

export interface IQuestionsApiResult {
  code: string;
  data: IQuestionsApiData;
}
