import React from 'react';
import { CommentsAction } from './actions';

export type Thunk = (dispatch: React.Dispatch<CommentsAction>) => void

export const thunkMiddleware = (dispatch: React.Dispatch<CommentsAction>) => (action: CommentsAction | Thunk) => {
  if (typeof action === 'function') {
    return action(dispatch);
  }

  return dispatch(action);
};
