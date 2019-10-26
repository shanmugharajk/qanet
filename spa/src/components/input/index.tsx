import React from 'react';
import { Form } from 'semantic-ui-react';

// TODO: props type
const Input = ({ field, form: { touched, errors }, ...props }: any) => (
  <Form.Input
    error={!!touched[field.name] && !!errors[field.name]}
    {...field}
    {...props}
  />
);

export default Input;
