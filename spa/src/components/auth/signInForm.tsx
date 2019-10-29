import React from 'react';
import Link from 'next/link';
import { Form, Button } from 'semantic-ui-react';
import { Field, FormikProps } from 'formik';
import InputField from '../inputField';
import ErrorText from '../errorText';

interface IProps extends FormikProps<{}> {
  errorMessage: string;
  redirectUrl?: string;
}

const LoginForm = function(props: IProps) {
  const signUpUrl = props.redirectUrl
    ? `/signup?redirectUrl=${props.redirectUrl}`
    : '/signup';

  return (
    <Form onSubmit={props.handleSubmit}>
      {props.errorMessage && <ErrorText text={props.errorMessage}></ErrorText>}
      <Field
        name="id"
        label="Email"
        placeholder="Email"
        type="email"
        component={InputField}
        autoComplete="username"
      />

      <Field
        name="password"
        label="Password"
        placeholder="Password"
        type="password"
        component={InputField}
        autoComplete="current-password"
      />

      <Form.Field>
        <Button type="submit" color="blue" disabled={props.isSubmitting}>
          Submit
        </Button>
        <Link href={`${signUpUrl}`}>
          <a>Need account? Signup now!</a>
        </Link>
      </Form.Field>
    </Form>
  );
};

export default LoginForm;
