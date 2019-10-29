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

const SignupForm = function(props: IProps) {
  const signInUrl = props.redirectUrl
    ? `/signin?redirectUrl=${props.redirectUrl}`
    : '/signin';

  return (
    <Form onSubmit={props.handleSubmit}>
      {props.errorMessage && <ErrorText text={props.errorMessage}></ErrorText>}
      <Field
        name="id"
        label="User Id"
        placeholder="User Id minimum 6 letters"
        type="text"
        component={InputField}
        autoComplete="id"
      />

      <Field
        name="displayName"
        label="Display Name"
        placeholder="enter the display name"
        type="text"
        component={InputField}
        autoComplete="displayName"
      />

      <Field
        name="email"
        label="Email"
        placeholder="Email"
        type="email"
        component={InputField}
        autoComplete="email"
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
        <Link href={signInUrl}>
          <a>Already had account? Login now!</a>
        </Link>
      </Form.Field>
    </Form>
  );
};

export default SignupForm;
