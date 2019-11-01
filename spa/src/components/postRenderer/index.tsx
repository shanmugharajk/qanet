import React from 'react';
import redraft from 'redraft';
import Container from './container';
import { renderer } from '../../lib/renderer';

interface IProps {
  content: string;
}

const PostRenderer = function(props: IProps) {
  return (
    <Container>
      {props.content && redraft(JSON.parse(props.content), renderer)}
    </Container>
  );
};

export default PostRenderer;
