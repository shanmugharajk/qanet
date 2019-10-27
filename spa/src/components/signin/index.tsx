import React from 'react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import { Header, Segment } from 'semantic-ui-react';
import api, {
  successCode,
  internalServerError
} from '../../../shared/endpoints';
import LoginForm from './signInForm';
import Container from './container';
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

const SignIn: React.SFC = function() {
  const [error, setError] = React.useState('');
  const router = useRouter();

  const onSubmit = async function(values: any, actions: any) {
    try {
      // Clear the existing error after submitting.
      setError('');

      const res = await axios.post(api.login, values);
      const resData = res.data;

      if (resData.code === successCode) {
        router.push('/');
        actions.resetForm({ ...initialValues });
      } else {
        setError(resData.data.message || internalServerError);
      }
    } catch (error) {
      setError(internalServerError);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Container>
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
    </Container>
  );
};

export default SignIn;
