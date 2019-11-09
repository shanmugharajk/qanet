import { css } from 'styled-components';

const style = css`
  font-size: 12px;
  background: #f5f5f5;
  color: #7d7c7c !important;
  padding: 5px 10px;
  width: 200px;

  .asked-at {
    margin-bottom: 5px;
  }

  .left {
    float: left;

    &.info {
      margin-left: 10px;
    }
  }

  .right {
    float: right;
  }

  .points {
    color: #696a6b;
    font-weight: bold;
  }
`;

export default style;
