import React from 'react';
import styled from 'styled-components';
import { FormikProps, Formik, FormikActions } from 'formik';
import { useRouter } from 'next/router';
import { Container } from 'semantic-ui-react';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { convertToRaw } from 'draft-js';
import api from '../../../../shared/endpoints';
import NewQuestionForm from './newQuestionForm';
import { postReq } from '../../../lib/customAxios';
import { ITag } from '../../../@types';

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

    const content = (
      convertToRaw(
        stateFromMarkdown(toPost.questionContent, {
          parserOptions: {
            breaks: true,
          },
        })
      )
    );

    toPost.questionContent = JSON.stringify(content);

    // Clear the existing error after submitting.
    setError('');

    const res = await postReq(api.askQuestion, toPost);

    actions.setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    router.push(`/questions/${res.data}`);
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
