import { css } from 'styled-components';

export default css`
  padding: 15px 0 15px 0;

  .list-item {
    display: flex;
    padding: 10px 0 10px 0;
    border-bottom: 1px solid #eff0f1 !important;

    a.question-link {
      font-size: 13.5px;
      font-weight: 100;
      color: #356ba0;
      padding-bottom: 5px;
    }

    &:hover {
      a.question-link {
        font-weight: 400;
        border-bottom: 1px dotted lightgray;
      }
    }

    .left-container {
      display: flex;
      text-align: center;
      color: #0d1025b0 !important;

      .vote,
      .answers {
        height: 58px;
        padding: 10px;

        span {
          display: block;
        }

        .count {
          font-size: 16px;
        }

        .text {
          font-size: 11px;
        }
      }

      .answers {
        margin-left: 10px;
      }

      .has-answers {
        border: 1px solid #3e8a57eb !important;
        color: #3e8a57eb !important;
      }

      .accepted {
        color: white;
        background: #3e8a57eb !important;
      }
    }

    .right-container {
      margin-left: 20px;
      flex: 1 auto;

      > div {
        display: flex;
      }

      .tags {
        flex: 1 auto;

        .custom-blue {
          color: #39739d;
          background-color: #cee0ed9c;
          border: 1px solid #9fadb845;
        }
      }

      .user-info {
        color: #7d7c7c !important;
        margin-right: 20px;
        font-size: 12px;

        a {
          padding: 0 5px 0 5px;
        }
      }
    }
  }
`;
