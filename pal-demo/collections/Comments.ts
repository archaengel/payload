import { CollectionConfig } from "../../src/collections/config/types";

const Comments: CollectionConfig = {
    slug: 'comments',
    fields: [
        {
            name: 'content-id',
            type: 'text',
            index: true,
        },
        {
            name: 'field',
            type: 'text',
        },
        {
            name: 'start-index',
            type: 'number'
        },
        {
            name: 'end-index',
            type: 'number'
        },
        {
            name: 'comment-content',
            type: 'text'
        }
    ]
}

export default Comments