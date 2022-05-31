import React, { useRef, useEffect, useCallback } from 'react';
import { Range } from 'slate';
import { requests } from '../../../api';
import { useConfig } from '../../utilities/Config';
import CommentElement from './CommentElement';
import { useCommentsContext } from './context';
import { CommentsProp, Comment } from './types';

import './index.scss';
import Button from '../../elements/Button';

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

  const baseName = 'comments';

  const {
    state,
    dispatch,
    reloadComments,
  } = useCommentsContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    dispatch({ type: 'SUCCEED_SAVE_COMMENT' });
    dispatch(reloadComments());
  }, [dispatch, serverURL, api, reloadComments]);

  useEffect(() => {
    dispatch(reloadComments());
  }, [dispatch, reloadComments]);

  useEffect(() => {
    if (state.isEditing) {
      inputRef.current.focus();
    }
  }, [state.isEditing]);

  const resetState = () => {
    dispatch({ type: 'CANCEL_COMMENT' });
  };

  const handleSave = (evt) => {
    evt.preventDefault();
    const comment = {
      'content-id': contentId,
      field: state.selectedField,
      'comment-content': state.text,
      range: state.selectedRange,
    };

    saveComment(comment);
  };

  const handleCancel = (evt) => {
    evt.preventDefault();
    resetState();
  };

  const openComment = (e) => {
    e.preventDefault();
    dispatch({
      type: 'OPEN_COMMENT',
      field: state.selectedField,
      range: state.selectedRange,
    });
  };

  return (
    <div className={`${baseName}`}>
      <div className={`${baseName}__list`}>
        {state.comments.map(renderComment)}
      </div>
      {state.selectedRange && !state.isEditing
        ? (
          <Button
            icon="plus"
            buttonStyle="icon-label"
            iconPosition="left"
            iconStyle="with-border"
            onClick={openComment}
          >
            Comment
          </Button>
        )
        : null}
      {state.isEditing
        ? (
          <React.Fragment>
            <input
              ref={inputRef}
              placeholder="Enter comment..."
              value={state.text ?? ''}
              onChange={(e) => dispatch({ type: 'UPDATE_COMMENT', text: e.target.value })}
              onFocus={() => dispatch({ type: 'UPDATE_RANGE', range: state.selectedRange })}
            />
            <div className={`${baseName}__tray`}>
              <Button
                buttonStyle="secondary"
                size="small"
                type="button"
                onClick={handleCancel}
              >
                cancel
              </Button>
              <Button
                buttonStyle="primary"
                size="small"
                type="submit"
                onClick={handleSave}
              >
                save
              </Button>
            </div>
          </React.Fragment>
        )
        : null}
    </div>
  );
};

export default CommentsView;
