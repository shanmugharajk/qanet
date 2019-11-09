import { css } from 'styled-components';

const style = css`
  padding-top: 10px;
  font-size: 11px;

  .icon {
    color: lightgray;
    cursor: pointer;
  }

  .comments {
    font-size: 12px;
    color: black;
  }

  .add-comments {
    font-size: 14px;
  }

  .comment-items {
    margin-bottom: 25px;
  }

  .mr-5 {
    margin-right: 5px;
  }

  .custom-blue-link {
    line-height: 0.4;
    background-color: #cee0ed73;
    color: #39739d;
    font-weight: lighter;
    margin-right: 5px !important;
  }

  .item {
    color: #0000005e;
    margin: 10px 0;
    padding: 10px;
    border-top: 1px solid #2224260f;

    &:last-child {
      border-bottom: 1px solid #2224260f;
    }
  }
`;

export default style;
