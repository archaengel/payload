import { Range } from 'slate';

export interface Comment {
    'comment-content': string
    field: string
    'content-id': string
    range: Range
}

export type CommentsProp = {
    contentId: string
}
