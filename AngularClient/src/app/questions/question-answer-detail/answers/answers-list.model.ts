import { Answer } from './answer/answer.model';
import Paginate from '../../../paginate.model';


export interface AnswersList extends Paginate {
  items: Array<Answer>;
}
