import React, { createContext, useCallback, useContext, useEffect, useReducer, useMemo} from 'react';
import { useRouteMatch } from 'react-router-dom';
import queryString from 'qs';
import { requests } from '../../../../api';
import { useConfig } from '../../../utilities/Config';
import { CommentsAction, commentsReducer, CommentsState, initCommentsState, Thunk, thunkMiddleware } from './reducer';

interface Context {
  state: CommentsState,
  dispatch: React.Dispatch<CommentsAction | Thunk>
  reloadComments: () => (dispatch: React.Dispatch<CommentsAction>) => Promise<void>
}

const CommentsContext = createContext({} as Context);

export const useCommentsContext = () => useContext(CommentsContext);

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, commentsDispatch] = useReducer(commentsReducer, initCommentsState);
  const { serverURL, routes: { api } } = useConfig();
  const { params: { id } = {} } = useRouteMatch<Record<string, string>>();


  const reloadComments = useCallback(() => async (dispatch: React.Dispatch<CommentsAction>) => {
    const commentQuery = {
      'content-id': {
        equals: id,
      },
    };
    if (!id) {
      // The currently viewed content may be new and therefore not have an id.
      // Load empty array of comments instead.
      dispatch({ type: 'SUCCEED_LOAD_COMMENTS', comments: [] });
      return;
    }
    const unwrap = ({ index }: {index: number}) => index;
    const dbRangeToSlateRange = (dbRange) => ({
      anchor: {
        ...dbRange.anchor,
        path: dbRange.anchor.path.map(unwrap),
      },
      focus: {
        ...dbRange.focus,
        path: dbRange.focus.path.map(unwrap),
      },
    });
    const dbCommentToSlate = (dbComment) => {
      return {
        ...dbComment,
        range: dbRangeToSlateRange(dbComment.range),
      };
    };
    const url = `${serverURL}${api}/comments`;
    const search = queryString.stringify({
      'fallback-locale': 'null', depth: 0, draft: 'true', where: commentQuery,
    });
    try {
      const response = await requests.get(`${url}?${search}`);

      // if (response.status > 201) {
        // setIsError(true);
      // }

      const json = await response.json();
      const comments = json.docs ? json.docs.map(dbCommentToSlate) : [];
      dispatch({ type: 'SUCCEED_LOAD_COMMENTS', comments });

      // setIsLoading(false);
    } catch (error) {
      // setIsError(true);
      // setIsLoading(false);
    }
  }, [api, serverURL, id]);

  const enhancedDispatch = useMemo(() => thunkMiddleware(commentsDispatch), [commentsDispatch]);


  return (
    <CommentsContext.Provider value={{
      state,
      dispatch: enhancedDispatch,
      reloadComments,
    }}
    >
      {children}
    </CommentsContext.Provider>
  );
};
