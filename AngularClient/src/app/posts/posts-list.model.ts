import Paginate from '../paginate.model';
import { Post } from './post.model';

export interface PostsList extends Paginate {
  items: Array<Post>;
}
