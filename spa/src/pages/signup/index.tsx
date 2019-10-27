import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import Signup from '../../components/signup';
import { ICustomContext } from '../_app';

interface IProps {}

const SignupPage: NextPage<IProps> = function() {
  return <Signup />;
};

interface Context extends ICustomContext {
  isLoggedIn: boolean;
}

SignupPage.getInitialProps = async function({ res, isLoggedIn }: Context) {
  if (isLoggedIn) {
    if (typeof window === 'undefined') {
      (res as any).redirect('/');
    } else {
      Router.push('/');
    }
  }

  return {};
};

export default SignupPage;
