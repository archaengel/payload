import { Config } from '../../config';
import { CollectionConfig } from '../collections/config/types';
import CollectionsMeta from './internalCollections/globals/CollectionsMeta';

const isWorkflowManaged = (collection: CollectionConfig): boolean => {
  return collection.workflow;
};

export function transform(config: Config): Config {
  const transformedConfig = { ...config };

  if (config.collections.some(isWorkflowManaged)) {
    const workflowManagedSlugs = config.collections
      .filter(isWorkflowManaged)
      .map((collection) => collection.slug);

    transformedConfig.globals = [
      ...(transformedConfig.globals ?? []),
      CollectionsMeta(workflowManagedSlugs),
    ];
  }

  return transformedConfig;
}
