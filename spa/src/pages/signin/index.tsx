import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import SignIn from '../../components/signin';
import { PageContext } from '../../@types';

interface IProps {}

const SignInPage: NextPage<IProps> = function() {
  return <SignIn />;
};

SignInPage.getInitialProps = async function(ctx: PageContext) {
  const { res, isLoggedIn } = ctx;

  if (isLoggedIn) {
    if (typeof window === 'undefined') {
      (res as any).redirect('/');
    } else {
      Router.push('/');
    }
  }

  return {};
};

export default SignInPage;
