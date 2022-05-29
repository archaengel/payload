import { Range } from 'slate';
import { Comment } from '../../types';

interface OpenComment {
  type: 'OPEN_COMMENT'
  range: Range
  field: string
}

interface UpdateComment {
  type: 'UPDATE_COMMENT'
  text: string
}

interface CancelComment {
  type: 'CANCEL_COMMENT'
}

interface DeleteComment {
  type: 'DELETE_COMMENT'
  id: string
}

interface AttemptSaveComment {
  type: 'ATTEMPT_SAVE_COMMENT'
  comment: Omit<Comment, 'id'>
}

interface FailSaveComment {
  type: 'FAIL_SAVE_COMMENT'
}

interface SucceedSaveComment {
  type: 'SUCCEED_SAVE_COMMENT'
}

interface AttemptLoadComments {
  type: 'ATTEMPT_LOAD_COMMENTS'
}

interface FailLoadComments {
  type: 'FAIL_LOAD_COMMENTS'
}

interface SucceedLoadComments {
  type: 'SUCCEED_LOAD_COMMENTS'
  comments: Comment[]
}

interface HighlightComment {
  type: 'HIGHLIGHT_COMMENT'
  range: Range
}

export type CommentsAction =
  | OpenComment
  | UpdateComment
  | CancelComment
  | DeleteComment
  | AttemptSaveComment
  | FailSaveComment
  | SucceedSaveComment
  | AttemptLoadComments
  | FailLoadComments
  | SucceedLoadComments
  | HighlightComment
