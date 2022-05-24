import React, { useState, useEffect, useCallback } from 'react';
import { CommentsProp } from './types';

const renderComment = ({'comment-content': content}, i: number) =>
<li key={`comment__${i}`}>{content}</li>


const CommentsView: React.FC<CommentsProp> = (props) => {
   const {
       saveComment,
        contentId,
        field,
        isEditing,
        setIsEditing
    } = props

   const [content, setContent] = useState("")

   const resetState = () => {
    setIsEditing(false)
    setContent("")
   }

   const handleSave = (evt) => {
       evt.preventDefault()
       const comment = {
           'content-id': contentId,
           field,
           'comment-content': content
       }

       saveComment(comment)
       resetState()
   }

   const handleCancel = (evt) => {
       evt.preventDefault()
       resetState()
   }

    return (
        <ul>
            {props.comments.map(renderComment)}
            {isEditing ?
              <li>
                  <input
                  placeholder='Enter comment...'
                  value={content}
                  onChange={((e) => setContent(e.target.value))}
                  />
                  <div>
                      <button onClick={handleCancel}>cancel</button>
                      <button onClick={handleSave}>
                          save
                      </button>
                  </div>
             </li> :
            null}
        </ul>
    )
}

export default CommentsView;
