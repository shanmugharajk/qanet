import { Question } from './question.model';
import Paginate from '../../paginate.model';

export interface QuestionsList extends Paginate {
  items: Array<Question>;
}
