import React from 'react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { Header, Segment } from 'semantic-ui-react';
import api, { successCode } from '../../api';
import LoginForm from './loginForm';
import LoginContainer from './loginContainer';
import axios from '../../lib/customAxios';

interface ILoginFormData {
  id: string;
  password: string;
}

const initialValues = { id: '', password: '' };

const validate = function({ id, password }: ILoginFormData) {
  let errors: any = {};

  if (!id) {
    errors.id = 'Required';
  }
  if (!password) {
    errors.password = 'Required';
  }

  return errors;
};

const Login = function() {
  const [error, setError] = React.useState('');
  const router = useRouter();

  const onSubmit = async function(values: any, actions: any) {
    try {
      const res = await axios.post(api.login, values);
      const resData = res.data;

      if (resData.code === successCode) {
        actions.resetForm({ ...initialValues });
        router.push('/');
      } else {
        setError(resData.data);
      }
    } catch (error) {
      setError('internal server error, try after sometime');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <Header attached="top" as="h4">
        Sign In
      </Header>
      <Segment attached>
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={onSubmit}
          validate={validate}
          render={(props: FormikProps<any>) => (
            <LoginForm {...props} errorMessage={error} />
          )}
        />
      </Segment>
    </LoginContainer>
  );
};

export default Login;
