import { GlobalConfig } from '../../src/globals/config/types';

const CollectionsMeta: GlobalConfig = {
  slug: 'collectionsMeta',
  fields: [
    {
      name: 'pages',
      type: 'relationship',
      relationTo: ['workflows'],
    },
  ],
};

export default CollectionsMeta;
