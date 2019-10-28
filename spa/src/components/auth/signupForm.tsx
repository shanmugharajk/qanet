import React from 'react';
import Link from 'next/link';
import { Form, Button } from 'semantic-ui-react';
import { Field, FormikProps } from 'formik';
import Input from '../input';
import ErrorText from '../errorText';

interface ISignupFormProps {}

interface IProps extends FormikProps<ISignupFormProps> {
  errorMessage: string;
}

const SignupForm = function(props: IProps) {
  return (
    <Form onSubmit={props.handleSubmit}>
      {props.errorMessage && <ErrorText text={props.errorMessage}></ErrorText>}
      <Field
        name="id"
        label="User Id"
        placeholder="User Id minimum 6 letters"
        type="text"
        component={Input}
        autoComplete="id"
      />

      <Field
        name="displayName"
        label="Display Name"
        placeholder="enter the display name"
        type="text"
        component={Input}
        autoComplete="displayName"
      />

      <Field
        name="email"
        label="Email"
        placeholder="Email"
        type="email"
        component={Input}
        autoComplete="email"
      />

      <Field
        name="password"
        label="Password"
        placeholder="Password"
        type="password"
        component={Input}
        autoComplete="current-password"
      />

      <Form.Field>
        <Button type="submit" color="blue" disabled={props.isSubmitting}>
          Submit
        </Button>
        <Link href="/signin">
          <a>Already had account? Login now!</a>
        </Link>
      </Form.Field>
    </Form>
  );
};

export default SignupForm;
