import React from 'react';
import { ITag } from '../../@types';
import style from './style';

interface IProps {
  tags: ITag[];
  style?: any;
  className?: any;
}

const TagsList = function(props: IProps) {
  return (
    <div
      css={style}
      style={props.style || {}}
      className={props.className || ''}
    >
      {props.tags &&
        props.tags.map(tag => (
          <div key={tag.id} className="ui label custom-blue">
            {tag.id}
          </div>
        ))}
    </div>
  );
};

export default TagsList;
