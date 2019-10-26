import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { NextPageContext } from 'next';
import App, { AppContext } from 'next/app';
import Header from '../components/header';
import cookies from '../lib/cookies';

export interface ICustomContext extends NextPageContext {
  userInfo: any;
  isLoggedIn: boolean;
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps: any = {};

    const userInfo = cookies.getByKey(ctx.req, 'userInfo');
    const isLoggedIn = !!userInfo;

    (ctx as any).isLoggedIn = isLoggedIn;
    (ctx as any).userInfo = userInfo;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.userInfo = userInfo;
    pageProps.isLoggedIn = isLoggedIn;

    pageProps.userInfo = pageProps.userInfo
      ? JSON.parse(pageProps.userInfo)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Header {...pageProps} />
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
