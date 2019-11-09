import React from 'react';
import utils from '../../../lib/utils';

interface IProps {
  modifiedAt: string;
  points: number;
  userId: string;
}

const UserInfo = function(props: IProps) {
  return (
    <div className="user-info">
      <span>{`asked ${utils.dateTime.format(props.modifiedAt)}`}</span>
      <a href={`/users/${props.userId}`}>{props.userId}</a>
      <span>{props.points}</span>
    </div>
  );
};

export default UserInfo;
