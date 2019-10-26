import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import Login from '../../components/login';
import { ICustomContext } from '../_app';

interface IProps {}

const LoginPage: NextPage<IProps> = function() {
  return <Login />;
};

interface Context extends ICustomContext {
  isLoggedIn: boolean;
}

LoginPage.getInitialProps = async function({ res, isLoggedIn }: Context) {
  if (isLoggedIn) {
    if (typeof window === 'undefined') {
      (res as any).redirect('/');
    } else {
      Router.push('/');
    }
  }

  return {};
};

export default LoginPage;
