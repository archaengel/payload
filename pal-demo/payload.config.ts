import path from 'path';
import { buildConfig } from '../src/config/build';
import Admin from './collections/Admin';
import PublicUser from './collections/PublicUsers';

import { Logo } from './components/Logo';
import { Icon } from './components/Icon';

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
    },
  ],
  admin: {
    user: 'admins',
    css: path.resolve(__dirname, 'styles/nav.css'),
    meta: {
      titleSuffix: '- Verily CMS',
      favicon: '/assets/favicon.ico',
      ogImage: '/assets/baseline.svg',
    },
    components: {
      graphics: {
        Logo,
        Icon,
      },
    },
  },
});
