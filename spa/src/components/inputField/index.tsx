import React from 'react';
import { Form, FormInputProps } from 'semantic-ui-react';

const InputField = ({
  field,
  form: { touched, errors },
  ...props
}: FormInputProps) => (
  <Form.Input
    error={!!touched[field.name] && !!errors[field.name]}
    {...field}
    {...props}
  />
);

export default InputField;
