import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import queryString from 'qs';
import { Range } from 'slate';
import { requests } from '../../../../api';
import { useConfig } from '../../../utilities/Config';
import { Comment } from '../types';


type UpdateFn<T> = (t: T) => void

interface Context {
    comments: Comment[]
    range: Range | null
    setRange: UpdateFn<Range | null>
    currentRange: Range | null
    setCurrentRange: UpdateFn<Range | null>
    isEditing: boolean
    setIsEditing: UpdateFn<boolean>
    fieldName: string
    setFieldName: UpdateFn<string>
    reloadComments: () => void
}

const CommentsContext = createContext({} as Context);

export const useCommentsContext = () => useContext(CommentsContext);

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [range, setRange] = useState<Range | null>(null);
  const [currentRange, setCurrentRange] = useState<Range | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { serverURL, routes: { api } } = useConfig();
  const { params: { id } = {} } = useRouteMatch<Record<string, string>>();


  const reloadComments = useCallback(async () => {
    const commentQuery = {
      'content-id': {
        equals: id,
      },
    };
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

      if (response.status > 201) {
        setIsError(true);
      }

      const json = await response.json();
      setComments(json.docs ? json.docs.map(dbCommentToSlate) : []);

      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [api, serverURL, id]);


  return (
    <CommentsContext.Provider value={{
      comments,
      range,
      setRange,
      setCurrentRange,
      currentRange,
      isEditing,
      setIsEditing,
      fieldName,
      setFieldName,
      reloadComments,
    }}
    >
      {children}
    </CommentsContext.Provider>
  );
};
