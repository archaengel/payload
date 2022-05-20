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
   
   const [content, setContent] = useState("Default")

   const handleSave = (evt) => {
       evt.preventDefault()
       const comment = {
           'content-id': contentId,
           field,
           'comment-content': content
       }

       saveComment(comment)
   }

    return (
        <ul>
            {props.comments.map(renderComment)}
            {isEditing ?
              <li>
                  <input
                  value={content}
                  onChange={((e) => setContent(e.target.value))}
                  />
                  <div>
                      <button>cancel</button>
                      <button onClick={handleSave}>
                          save
                      </button>
                  </div>
             </li> :
            null}
            <li>{content}</li>
        </ul>
    )
} 

export default CommentsView;
