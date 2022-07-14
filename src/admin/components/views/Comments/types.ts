import { Range } from 'slate';

export interface Comment {
  id: string,
  'comment-content': string
  field: string
  'content-id': string
  range: Range
  author: string
}

export type CommentsProp = {
  contentId: string
}
