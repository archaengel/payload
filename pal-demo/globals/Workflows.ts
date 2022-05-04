import { CollectionConfig } from '../../src/collections/config/types';
import { Field } from '../../src/fields/config/types';
import roles from '../access/roles';

const Stage: Field = {
  name: 'stage',
  type: 'group',
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'approver',
      type: 'select',
      options: roles,
    },
  ],
};

const Workflows: CollectionConfig = {
  slug: 'workflows',
  fields: [
    {
      name: 'workflowName',
      label: 'Workflow Name',
      type: 'text',
      unique: true,
    },
    {
      name: 'stages',
      type: 'array',
      fields: [Stage],
    },
  ],
  admin: {
    useAsTitle: 'workflowName',
  },
};

export default Workflows;
