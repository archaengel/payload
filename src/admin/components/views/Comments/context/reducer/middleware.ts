import React from 'react';
import { CommentsAction } from './actions';
import { CommentsState } from './reducer';

interface Store {
  dispatch: React.Dispatch<CommentsAction>
  state: CommentsState
}

type Thunk = (dispatch: React.Dispatch<CommentsAction>) => void

export const thunk = (store: Store) => (next: React.Dispatch<CommentsAction>) => (action: CommentsAction | Thunk) => {
  if (typeof action === 'function') {
    return action(store.dispatch);
  }

  return next(action);
};
