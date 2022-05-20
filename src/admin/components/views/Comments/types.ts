export interface Comment {
    'comment-content': string
    field: string
    'content-id': string
}

export type CommentsProp = {
    comments: Comment[]
    saveComment: (comment: Comment) => void
    contentId: string
    field: string
    isEditing: boolean
    setIsEditing: (isEditing: boolean) => void
}
