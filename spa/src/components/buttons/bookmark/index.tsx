import React from 'react';
import IconBase from '../iconBase';
import ButtonBase, { IButtonBaseProps } from '../buttonBase';
import styles from './style';

interface IProps extends IButtonBaseProps {
  bookmarks: number;
  selfBookmarked?: boolean;
}

export default function Bookmark(props: IProps) {
  const { bookmarks, selfBookmarked, ...restProps } = props;

  return (
    <ButtonBase {...restProps} css={styles}>
      <IconBase
        className={`big star icon ${selfBookmarked ? 'bookmarked' : ''}`}
      ></IconBase>
      {bookmarks > 0 && (
        <span className={selfBookmarked ? 'bookmarked' : ''}>{bookmarks}</span>
      )}
    </ButtonBase>
  );
}
