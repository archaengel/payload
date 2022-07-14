import { CollectionConfig } from '../../src/collections/config/types';

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
      name: 'author',
      type: 'text',
    },
    {
      name: 'range',
      type: 'group',
      fields: [
        {
          name: 'anchor',
          type: 'group',
          fields: [
            {
              name: 'path',
              type: 'array',
              fields: [
                {
                  name: 'index',
                  type: 'number',
                },
              ],
            },
            {
              name: 'offset',
              type: 'number',
            },
          ],
        },
        {
          name: 'focus',
          type: 'group',
          fields: [
            {
              name: 'path',
              type: 'array',
              fields: [
                {
                  name: 'index',
                  type: 'number',
                },
              ],
            },
            {
              name: 'offset',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'comment-content',
      type: 'text',
    },
  ],
};

export default Comments;
