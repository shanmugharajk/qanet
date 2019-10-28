import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import Signup from '../../components/signup';
import { PageContext } from '../../@types';

interface IProps {}

const SignupPage: NextPage<IProps> = function() {
  return <Signup />;
};

SignupPage.getInitialProps = async function({ res, isLoggedIn }: PageContext) {
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
