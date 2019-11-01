import React from 'react';
import ButtonBase, { IButtonBaseProps } from './buttonBase';
import IconBase from './iconBase';

const Downvote = function(props: IButtonBaseProps) {
  return (
    <ButtonBase {...props}>
      <IconBase className="huge caret down icon"></IconBase>
    </ButtonBase>
  );
};

export default Downvote;
