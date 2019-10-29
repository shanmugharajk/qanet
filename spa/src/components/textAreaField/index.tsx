import React from 'react';
import { Form, FormTextAreaProps } from 'semantic-ui-react';

const TextAreaField = function({
  field,
  form: { touched, errors },
  ...props
}: FormTextAreaProps) {
  return (
    <Form.TextArea
      error={!!touched[field.name] && !!errors[field.name]}
      {...field}
      {...props}
    />
  );
};

export default TextAreaField;
