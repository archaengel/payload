import { Range } from 'slate';
import { Comment } from '../../types';
import { CommentsAction } from './actions';

export interface CommentsState {
  comments: Comment[]
  selectedRange: Range | null
  selectedField: string | null
  text: string | null
  isEditing: boolean
}

export const commentsReducer = (state: CommentsState, action: CommentsAction): CommentsState => {
  switch (action.type) {
    case 'OPEN_COMMENT':
      return ({
        ...state,
        selectedRange: action.range,
        selectedField: action.field,
        isEditing: true,
      });
    case 'UPDATE_COMMENT':
      return ({
        ...state,
        text: action.text,
      });
    case 'CANCEL_COMMENT':
      return ({
        ...state,
        selectedRange: null,
        selectedField: null,
        text: null,
        isEditing: false,
      });
    case 'SUCCEED_LOAD_COMMENTS':
      return ({
        ...state,
        comments: action.comments,
      });
    case 'HIGHLIGHT_COMMENT':
      return ({
        ...state,
        selectedRange: action.range,
      });
    default:
      return { ...state };
  }
};
