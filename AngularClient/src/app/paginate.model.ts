export default interface Paginate {
  'index': number;
  'size': number;
  'count': number;
  'pages': number;
  'hasPrevious': boolean;
  'hasNext': boolean;
  'items': any;
}
