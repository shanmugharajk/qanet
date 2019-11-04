import React from 'react';
import redraft from 'redraft';
import style from './style';
import { renderer } from '../../lib/renderer';

interface IProps {
  content: string;
}

const PostRenderer = function (props: IProps) {
  return (
    <div css={style}>
      {props.content && redraft(JSON.parse(props.content), renderer)}
    </div>
  );
};

export default PostRenderer;
