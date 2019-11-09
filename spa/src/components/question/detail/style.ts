import { css } from 'styled-components';

export default css`
  .bottom-row {
    margin-top: 20px;
  }

  .post-menus {
    flex: 1 auto;

    a {
      font-size: 13px;
      margin-right: 5px;
      color: #848d95;

      :hover,
      :active {
        color: #3b4045;
      }
    }
  }
`;
