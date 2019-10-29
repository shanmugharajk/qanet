import React from 'react';
import styled from 'styled-components';
import { FormikProps, Formik, FormikActions } from 'formik';
import { useRouter } from 'next/router';
import { Container } from 'semantic-ui-react';
import api from '../../../shared/endpoints';
import { postReq } from '../../lib/customAxios';
import NewQuestionForm from './newQuestionForm';
import { AxiosResponse } from 'axios';
import { ITag, IPostReqResponse } from '../../@types';
import { successCode, internalServerError } from '../../../shared/messages';

interface IProps {
  tags: ITag[];
}

interface IFormData {
  title: string;
  questionContent: string;
  tags: ITag[];
}

const initialValues = {
  title: '',
  questionContent: '',
  tags: []
};

const FormContainer = styled('div')`
  margin: 10px 0 20px 0;
`;

const validate = function(formData: IFormData) {
  const { title, questionContent, tags } = formData;

  let errors: any = {};

  if (!title) {
    errors.title = 'Required';
  }

  if (!questionContent) {
    errors.questionContent = 'Required';
  }

  if (!tags || tags.length === 0) {
    errors.tags = 'Required';
  }

  return errors;
};

const NewQuestion = function(props: IProps) {
  const router = useRouter();
  const [error, setError] = React.useState('');

  const onSubmit = async function(
    values: IFormData,
    actions: FormikActions<IProps>
  ) {
    const toPost: any = { ...values };
    toPost.tags = [...toPost.tags].join(',');

    // Clear the existing error after submitting.
    setError('');

    const res = await postReq(api.askQuestion, toPost);

    actions.setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    // TODO: push to the questionDetail page with id
    // router.push('url');
  };

  return (
    <Container>
      <h4>Ask a question</h4>
      <FormContainer>
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={onSubmit}
          validate={validate}
          render={(formikProps: FormikProps<any>) => (
            <NewQuestionForm
              {...formikProps}
              errorMessage={error}
              tags={props.tags}
            />
          )}
        />
      </FormContainer>
    </Container>
  );
};

export default NewQuestion;
