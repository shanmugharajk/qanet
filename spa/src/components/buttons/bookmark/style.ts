import { css } from 'styled-components';

const styles = css`
  i {
    font-size: 15px !important;
    color: lightgray !important;
    padding: 0 10px;
    margin: 0;

    &.bookmarked {
      color: #eabd05 !important;
    }
  }

  span {
    display: block;
    margin: 12px 0;
    font-size: 13px;

    &.bookmarked {
      color: #eabd05 !important;
    }
  }
`;

export default styles;
