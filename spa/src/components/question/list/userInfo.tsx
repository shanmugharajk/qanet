import React from 'react';
import moment from 'moment';

interface IProps {
  modifiedAt: string;
  points: number;
  userId: string;
}

// tslint:disable-next-line: quotemark
const dateFormatterString = "MMM DD'YY HH:mm";

const UserInfo = function(props: IProps) {
  return (
    <div className="user-info">
      <span>{`asked ${moment(props.modifiedAt).format(
        dateFormatterString
      )}`}</span>
      <a href={`/users/${props.userId}`}>{props.userId}</a>
      <span>{props.points}</span>
    </div>
  );
};

export default UserInfo;
