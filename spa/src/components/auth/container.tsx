import styled from 'styled-components';

const Container = styled('div')`
  padding: 50px 0 50px 0;
  margin: auto;
  width: 600px !important;

  .ui.top.attached.header {
    background: #f0f0f0;
  }

  .error-message {
    width: 410px;
    margin: auto;
    margin-bottom: 20px;
  }

  .ui.negative.message .header {
    margin-bottom: 10px;
  }

  .form-fields {
    width: 500px;
    margin: auto;
  }

  @media only screen and (max-width: 600px) {
    padding: 100px 10px 10px 10px;
    margin: auto;
    width: 100% !important;

    .form-fields {
      width: auto;
      margin: auto;
    }
  }
`;

export default Container;
