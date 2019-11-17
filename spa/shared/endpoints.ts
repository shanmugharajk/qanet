// TODO: Setup prod url
export const baseUrl = 'http://localhost:4000/api';

export const authBaseUrl = 'http://localhost:3000/api';

export default {
  login: `${authBaseUrl}/signin`,

  signUp: `${authBaseUrl}/signup`,

  tags: `${baseUrl}/questions/tags`,

  askQuestion: `${baseUrl}/questions/ask`,

  submitAnswer: (questionId: number | string) =>
    `${baseUrl}/${questionId}/answer/submit`,

  questionDetail: (id: string) => `${baseUrl}/questions/${id}`,

  getQuestions: (cursor?: string) =>
    cursor ? `${baseUrl}/questions?cursor=${cursor}` : `${baseUrl}/questions`
};
