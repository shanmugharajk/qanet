import { NextPageContext } from 'next';

export interface ICustomContext extends NextPageContext {
  userInfo: any;
  isLoggedIn: boolean;
}

export interface PageContext extends ICustomContext {
  isLoggedIn: boolean;
}

export interface ITag {
  id: string;
  description: string;
}

export interface IPostReqResponse {
  data: any;
  error?: string;
}