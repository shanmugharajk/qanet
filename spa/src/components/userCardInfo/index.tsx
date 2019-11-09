import React from 'react';
import style from './style';
import Gravatar from './gravatar';
import utils from '../../lib/utils';

interface IProps {
  askedAt: string;
  createdBy: string;
  authorPoints: number;
}

export default function UserCardInfo(props: IProps) {
  const { askedAt, createdBy, authorPoints } = props;

  return (
    <div css={style}>
      <div className="asked-at">
        <span>{`asked ${utils.dateTime.format(askedAt)}`}</span>
      </div>

      <div className="left">
        <Gravatar />
      </div>

      <div className="left info">
        <a href="#" className="author">
          {createdBy}
        </a>
        <div className="points">
          <span>{authorPoints}</span>
        </div>
      </div>
    </div>
  );
}
