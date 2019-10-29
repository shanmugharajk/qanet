import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { Field, FormikProps } from 'formik';
import InputField from '../inputField';
import TextAreaField from '../textAreaField';
import DropdownField from '../dropDownField';
import { ITag } from '../../@types';

interface IProps extends FormikProps<{}> {
  errorMessage: string;
  tags: ITag[];
}

const getTagsDropdownData = function(tags: ITag[]) {
  return tags.map(t => ({ key: t.id, value: t.id, text: t.id }));
};

const NewQuestionForm = function(props: IProps) {
  return (
    <Form onSubmit={props.handleSubmit}>
      {props.errorMessage && <Message negative content={props.errorMessage} />}
      <Field
        name="title"
        label="Title"
        placeholder="Enter the questiontitle"
        type="text"
        component={InputField}
        autoComplete="title"
      />

      <Field
        name="questionContent"
        label="Body"
        type="text"
        rows={15}
        component={TextAreaField}
      />

      <Field
        name="tags"
        label="Tags"
        clearable
        fluid
        multiple
        search
        selection
        options={getTagsDropdownData(props.tags)}
        placeholder="Select tag"
        component={DropdownField}
      />

      <Form.Field>
        <Button
          type="submit"
          color="blue"
          size="small"
          compact
          disabled={props.isSubmitting}
        >
          Post Your Question
        </Button>
      </Form.Field>
    </Form>
  );
};

export default NewQuestionForm;
