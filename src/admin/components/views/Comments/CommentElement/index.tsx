import React from 'react';
import { useCommentsContext } from '../context';
import { CommentProps } from './types';

const CommentElement: React.FC<CommentProps> = ({ comment: { 'comment-content': content, range } }) => {
  const { setCurrentRange } = useCommentsContext();
  return (
    <li>
      <button
        type="button"
        onClick={() => setCurrentRange(range)}
      >
        {content}
      </button>
    </li>
  );
};

export default CommentElement;
