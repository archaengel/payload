import { Field } from '../fields/config/types';

export const pre = '@@pre_workflow';
export const post = '@@post_workflow';

const baseWorkflowFields: Field[] = [
  {
    name: '_workflow_stage',
    label: 'Stage',
    type: 'text',
    defaultValue: pre,
    admin: {
      components: {
        Field: () => null,
      },
    },
  },
];

export default baseWorkflowFields;
