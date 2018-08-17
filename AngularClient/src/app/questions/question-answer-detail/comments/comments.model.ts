import Paginate from '../../../paginate.model';
import Comment from './comment.model';

export default interface Comments extends Paginate {
  items: Array<Comment>;
}
