import React from 'react';
import { IComment, IUserInfo } from '../../@types';
import Item from './item';
import style from './style';

interface IProps {
  comments: IComment[];
  currentUserInfo: IUserInfo;
}

const Comments = function(props: IProps) {
  const { comments, currentUserInfo } = props;

  return (
    <div css={style}>
      <div className="comment-items">
        {comments.map(comment => (
          <Item
            key={comment.id}
            comment={comment}
            editable={!!currentUserInfo.userId}
          />
        ))}
      </div>
      {!!currentUserInfo.userId && (
        <a href="#" className="add-comments">
          add comment
        </a>
      )}
    </div>
  );
};

export default Comments;
