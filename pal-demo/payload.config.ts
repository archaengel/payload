import { buildConfig } from '../src/config/build';
import Admin from './collections/Admin';
import PublicUser from './collections/PublicUsers';
import Workflows from './globals/Workflows';

export default buildConfig({
  // By default, Payload will boot up normally
  // and you will be provided with a base `User` collection.
  // But, here is where you define how you'd like Payload to work!

  collections: [
    Admin,
    PublicUser,
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
      ],
      versions: {
        drafts: true,
      },
      workflow: true,
    },
    {
      slug: 'articles',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'text',
          required: true,
        },
      ],
      versions: {
        drafts: true,
      },
      workflow: true,
    },
    Workflows,
  ],
  admin: {
    user: 'admins',
  },
});
