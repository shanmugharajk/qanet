import { NextPageContext } from 'next';

export interface ICustomContext extends NextPageContext {
    userInfo: any;
    isLoggedIn: boolean;
}

export interface PageContext extends ICustomContext {
    isLoggedIn: boolean;
}