// TODO: Setup prod url
export const baseUrl = 'http://localhost:4000/api';

export const authBaseUrl = 'http://localhost:3000/api';

export const successCode = 'SUCCESS';

export const failureCode = 'ERROR';

export const internalServerError =
  'Internal server error. Please try after sometime';

export default {
  login: `${authBaseUrl}/signin`,
  signUp: `${authBaseUrl}/signup`
};
