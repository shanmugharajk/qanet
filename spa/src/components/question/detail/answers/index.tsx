import React from 'react';
import { Header } from 'semantic-ui-react';
import style from './style';
import { IAnswer, IUserInfo } from '../../../../@types';
import NewAnswer from './new';
import Answer from './answer';

interface IProps {
  answers: IAnswer[];
  userInfo: IUserInfo;
}

export default function Answers(props: IProps) {
  return (
    <div css={style}>
      {props.answers.length > 0 && (
        <Header as="h3" dividing>
          Answers
        </Header>
      )}
      <div className="answers-container">
        {props.answers.map(answer => (
          <Answer key={answer.id} answer={answer} userInfo={props.userInfo} />
        ))}
      </div>
      <NewAnswer />
    </div>
  );
}
