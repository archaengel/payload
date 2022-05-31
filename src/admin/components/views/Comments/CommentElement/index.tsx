import React from 'react';
import { useCommentsContext } from '../context';
import { CommentProps } from './types';
import './index.scss';

const CommentElement: React.FC<CommentProps> = ({ comment: { 'comment-content': content, range, field } }) => {
  const baseName = 'comment';
  const { state, dispatch } = useCommentsContext();
  const highlightRange = () => {
    if (!state.isEditing) {
      dispatch({ type: 'HIGHLIGHT_TEXT', range, field });
    }
  };
  return (
    <div
      className={`${baseName}__card`}
      role="button"
      onClick={highlightRange}
      onMouseOver={highlightRange}
      onFocus={highlightRange}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          highlightRange();
        }
      }}
    >
      {content}
    </div>
  );
};

export default CommentElement;
