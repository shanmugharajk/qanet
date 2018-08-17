import { Question } from './question.model';

export interface QuestionsList {
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Array<Question>;
}
