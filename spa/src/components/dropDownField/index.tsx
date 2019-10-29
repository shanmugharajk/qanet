import * as React from 'react';
import { Form } from 'semantic-ui-react';
import styled from 'styled-components';

const DropDownField = ({
  field: { name, value },
  form: { touched, errors, setFieldValue, setFieldTouched },
  options,
  children: _,
  ...props
}: any) => {
  return (
    <Form.Dropdown
      selection
      options={options}
      value={value}
      onChange={(_, { value }) => setFieldValue(name, value)}
      onBlur={(_, { value }) => setFieldTouched(name, value)}
      error={!!touched[name] && !!errors[name]}
      {...props}
    />
  );
};

export default styled(DropDownField)`
  .ui.selection.dropdown:hover {
    :hover {
      border-color: #22242626;
    }
  }
`;
