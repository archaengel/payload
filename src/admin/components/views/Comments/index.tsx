import React, { useState, useEffect, useCallback } from 'react';
import { Range } from 'slate';
import { requests } from '../../../api';
import { useConfig } from '../../utilities/Config';
import CommentElement from './CommentElement';
import { useCommentsContext } from './context';
import { CommentsProp, Comment } from './types';

const renderComment = (comment: Comment) => (
  <CommentElement
    key={`comment__${comment.id}`}
    comment={comment}
  />
);

const CommentsView: React.FC<CommentsProp> = (props) => {
  const {
    contentId,
  } = props;

  const {
    comments,
    isEditing,
    setIsEditing,
    fieldName: field,
    reloadComments,
    range,
    setCurrentRange,
  } = useCommentsContext();

  const { serverURL, routes: { api } } = useConfig();

  const saveComment = useCallback(async (comment: Omit<Comment, 'id'>) => {
    const action = `${serverURL}${api}/comments`;
    const indexWrap = (index: number) => ({ index });
    const slateToPayloadRange = ({ anchor, focus }: Range) => ({
      anchor: {
        ...anchor,
        path: anchor.path.map(indexWrap),
      },
      focus: {
        ...focus,
        path: focus.path.map(indexWrap),
      },
    });

    await requests.post(action, {
      body: JSON.stringify({
        'content-id': comment['content-id'],
        field: comment.field,
        'comment-content': comment['comment-content'],
        range: slateToPayloadRange(comment.range),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, [serverURL, api]);

  useEffect(() => {
    reloadComments();
  }, [reloadComments]);

  const [content, setContent] = useState('');

  const resetState = () => {
    setIsEditing(false);
    setContent('');
  };

  const handleSave = (evt) => {
    evt.preventDefault();
    const comment = {
      'content-id': contentId,
      field,
      'comment-content': content,
      range,
    };

    saveComment(comment);
    reloadComments();
    resetState();
  };

  const handleCancel = (evt) => {
    evt.preventDefault();
    resetState();
  };

  return (
    <ul>
      {comments.map(renderComment)}
      {isEditing
        ? (
          <li>
            <input
              placeholder="Enter comment..."
              value={content}
              onChange={((e) => setContent(e.target.value))}
              onFocus={() => setCurrentRange(range)}
            />
            <div>
              <button
                type="button"
                onClick={handleCancel}
              >
                cancel
              </button>
              <button
                type="submit"
                onClick={handleSave}
              >
                save
              </button>
            </div>
          </li>
        )
        : null}
    </ul>
  );
};

export default CommentsView;
