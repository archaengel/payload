import React, { useCallback } from 'react';
import FormSubmit from '../../forms/Submit';
import { Props } from './types';
import { useDocumentInfo } from '../../utilities/DocumentInfo';
import { useForm, useFormModified } from '../../forms/Form/context';
import { post } from '../../../../workflows/baseFields';

const Publish: React.FC<Props> = ({ workflowManaged }) => {
  const { unpublishedVersions, publishedDoc } = useDocumentInfo();
  const { submit } = useForm();
  const modified = useFormModified();

  const hasNewerVersions = unpublishedVersions?.totalDocs > 0;
  const canPublish = modified || hasNewerVersions || !publishedDoc;

  const publish = useCallback(() => {
    const overrides = {
      _status: 'published',
    };

    if (workflowManaged) {
      overrides["_workflow_stage"] = post
    }

    submit({
      overrides
    });
  }, [submit, workflowManaged]);

  return (
    <FormSubmit
      type="button"
      onClick={publish}
      disabled={!canPublish}
    >
      {`Publish ${workflowManaged ? 'content' : 'changes'}`}
    </FormSubmit>
  );
};

export default Publish;
