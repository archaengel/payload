import { Field } from '../../fields/config/types';
import { GlobalConfig } from '../../globals/config/types';

const CollectionsMetaField = (name: string): Field => ({
  name,
  type: 'relationship',
  relationTo: ['workflows'],
});

const CollectionsMeta = (names: string[]): GlobalConfig => ({
  slug: 'collectionsMeta',
  fields:
    names.map(CollectionsMetaField),
});

export default CollectionsMeta;
