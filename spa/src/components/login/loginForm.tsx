import React from "react";
import Link from "next/link";
import { Form, Button } from "semantic-ui-react";
import { Field, FormikProps } from "formik";
import Input from "../input";

interface ILoginFormProps {}

interface IProps extends FormikProps<ILoginFormProps> {
  errorMessage: string;
}

const LoginForm = function(props: IProps) {
  return (
    <Form onSubmit={props.handleSubmit}>
      <Field
        name="id"
        label="Email"
        placeholder="Email"
        type="email"
        component={Input}
        autoComplete="username"
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
        <Link href="/signup">
          <a>Need account? Signup now!</a>
        </Link>
      </Form.Field>
    </Form>
  );
};

export default LoginForm;
