import React from 'react';
import { Header, Button } from 'semantic-ui-react';
import CustomTextArea from './customTextArea';

export default function NewAnswer() {
  return (
    <div>
      <Header as="h3" dividing>
        Your Answer
      </Header>

      <CustomTextArea
        name="questionContent"
        label="Body"
        type="text"
        rows={15}
      />

      <Button color="blue" size="small" compact>
        Post Your answer
      </Button>
    </div>
  );
}
