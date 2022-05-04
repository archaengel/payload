import React, { useCallback } from 'react';
import FormSubmit from '../../forms/Submit';
import { Props } from './types';
import { useForm } from '../../forms/Form/context';
import { post } from '../../../../workflows/baseFields'

const Promote: React.FC<Props> = (props) => {
  const {
    nextStage,
    hasStagePermission,
    hasWorkflow,
  } = props;
  const { submit } = useForm();

  const promote = useCallback(() => {
    submit({
      overrides: {
        _workflow_stage: nextStage || post,
      },
    });
  }, [submit, nextStage]);

  const promotionMessage = nextStage ? `Promote to ${nextStage}` : 'Publish changes'
  const message = !hasWorkflow
    ? 'Workflow not selected'
    : promotionMessage

  return (
    <FormSubmit
      type="button"
      onClick={promote}
      disabled={!(hasStagePermission && hasWorkflow)}
    >
      {message}
    </FormSubmit>
  );
};

export default Promote;
