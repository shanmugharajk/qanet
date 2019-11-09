import React from 'react';
import { IComment } from '../../@types';
import utils from '../../lib/utils';

interface IProps {
  comment: IComment;
  editable: boolean;
}

export default function Item(props: IProps) {
  const { comment, editable } = props;

  return (
    <div className="item">
      <span className="comments mr-5">{comment.comments}</span>
      <span className="mr-5">
        <a className="ui label custom-blue-link" href="#">
          {comment.updatedBy}
        </a>
        {utils.dateTime.format(comment.updatedAt)}
      </span>
      {editable && (
        <>
          <a>
            <i className="edit icon"></i>
          </a>
          <a>
            <i className="trash icon"></i>
          </a>
        </>
      )}
    </div>
  );
}
