import React from 'react';
import ButtonBase, { IButtonBaseProps } from '../buttonBase';
import IconBase from '../iconBase';

const Upvote = function(props: IButtonBaseProps) {
  return (
    <ButtonBase {...props}>
      <IconBase className="huge caret up icon"></IconBase>
    </ButtonBase>
  );
};

export default Upvote;
