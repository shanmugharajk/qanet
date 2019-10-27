import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import api, {
  successCode,
  internalServerError
} from '../../../shared/endpoints';
import axios from '../../lib/customAxios';
import Container from '../signin/container';
import SignupForm from './signupForm';

interface ISignupFormData {
  id: string;
  displayName: string;
  email: string;
  password: string;
}

const initialValues = { id: '', password: '', email: '', displayName: '' };

const validate = function(data: ISignupFormData) {
  const { id, password, email, displayName } = data;

  let errors: any = {};

  if (!id) {
    errors.id = 'Required';
  }
  if (!displayName) {
    errors.displayName = 'Required';
  }
  if (!email) {
    errors.email = 'Required';
  }
  if (!password) {
    errors.password = 'Required';
  }

  return errors;
};

const SignUp: React.SFC = function() {
  const [error, setError] = React.useState('');
  const router = useRouter();

  const onSubmit = async function(values: any, actions: any) {
    try {
      // Clear the existing error after submitting.
      setError('');

      const res = await axios.post(api.signUp, values);
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
        Signup
      </Header>
      <Segment attached>
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={onSubmit}
          validate={validate}
          render={(props: FormikProps<any>) => (
            <SignupForm {...props} errorMessage={error} />
          )}
        />
      </Segment>
    </Container>
  );
};

export default SignUp;
