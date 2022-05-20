import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { useConfig } from '../../../utilities/Config';
import { useAuth } from '../../../utilities/Auth';
import { useStepNav } from '../../../elements/StepNav';
import usePayloadAPI from '../../../../hooks/usePayloadAPI';

import RenderCustomComponent from '../../../utilities/RenderCustomComponent';
import DefaultEdit from './Default';
import formatFields from './formatFields';
import buildStateFromSchema from '../../../forms/Form/buildStateFromSchema';
import { NegativeFieldGutterProvider } from '../../../forms/FieldTypeGutter/context';
import { useLocale } from '../../../utilities/Locale';
import { IndexProps } from './types';
import { StepNavItem } from '../../../elements/StepNav/types';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import { Stage } from '../../../utilities/Workflow';

const EditView: React.FC<IndexProps> = (props) => {
  const { collection: incomingCollection, isEditing } = props;

  const {
    slug,
    labels: {
      plural: pluralLabel,
    },
    admin: {
      useAsTitle,
      components: {
        views: {
          Edit: CustomEdit,
        } = {},
      } = {},
    } = {},
  } = incomingCollection;

  const [fields] = useState(() => formatFields(incomingCollection, isEditing));
  const [collection] = useState(() => ({ ...incomingCollection, fields }));

  const locale = useLocale();
  const { serverURL, routes: { admin, api } } = useConfig();
  const { params: { id } = {} } = useRouteMatch<Record<string, string>>();
  const { state: locationState } = useLocation();
  const history = useHistory();
  const { setStepNav } = useStepNav();
  const [initialState, setInitialState] = useState({});
  const { permissions, user } = useAuth();
  const { getVersions } = useDocumentInfo();

  const onSave = useCallback(async (json: any) => {
    getVersions();
    if (!isEditing) {
      history.push(`${admin}/collections/${collection.slug}/${json?.doc?.id}`);
    } else {
      const state = await buildStateFromSchema({ fieldSchema: collection.fields, data: json.doc, user, id, operation: 'update', locale });
      setInitialState(state);
    }
  }, [admin, collection, history, isEditing, getVersions, user, id, locale]);

  const [{ data, isLoading, isError }] = usePayloadAPI(
    (isEditing ? `${serverURL}${api}/${slug}/${id}` : null),
    { initialParams: { 'fallback-locale': 'null', depth: 0, draft: 'true' } },
  );

  const [{ data: collectionsMetaData }] = usePayloadAPI(
     (isEditing ? `${serverURL}${api}/globals/collectionsMeta` : null),
    { initialParams: { 'fallback-locale': 'null', depth: 1, draft: 'true' } },
  );

  const collectionMeta = collectionsMetaData[slug]
  const hasWorkflow = collectionMeta !== null && collectionMeta !== undefined
  const collectionStages = hasWorkflow ? collectionMeta.value?.stages : []

  const [{ data: userData }] = usePayloadAPI(
     (isEditing ? `${serverURL}${api}/admins/${user.id}` : null),
    { initialParams: { 'fallback-locale': 'null', depth: 0, draft: 'true' } },
  );

  const {roles: userRoles = []} = userData

  const dataToRender = (locationState as Record<string, unknown>)?.data || data;

  const commentQuery = {
    'content-id': {
      equals: id
    }
  };

  const [{ data: { docs: comments } }] = usePayloadAPI(
    (isEditing ? `${serverURL}${api}/comments` : null),
   { initialParams: { 'fallback-locale': 'nu1ll', depth: 0, draft: 'true', where: commentQuery } },
 );

 const [isEditingComment, setIsEditingComment] = useState(false)

 const addComment = (name: string) => (e) => {
   console.log(id)
   console.log(name)
   setIsEditingComment(true);
   e.preventDefault()
 }

 console.log(comments);

  useEffect(() => {
    const nav: StepNavItem[] = [{
      url: `${admin}/collections/${slug}`,
      label: pluralLabel,
    }];

    if (isEditing) {
      let label = '';

      if (dataToRender) {
        if (useAsTitle) {
          if (dataToRender[useAsTitle]) {
            label = dataToRender[useAsTitle];
          } else {
            label = '[Untitled]';
          }
        } else {
          label = dataToRender.id;
        }
      }

      nav.push({
        label,
      });
    } else {
      nav.push({
        label: 'Create New',
      });
    }

    setStepNav(nav);
  }, [setStepNav, isEditing, pluralLabel, dataToRender, slug, useAsTitle, admin]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const awaitInitialState = async () => {
      const state = await buildStateFromSchema({ fieldSchema: fields, data: dataToRender, user, operation: isEditing ? 'update' : 'create', id, locale });
      setInitialState(state);
    };

    awaitInitialState();
  }, [dataToRender, fields, isEditing, id, user, locale, isLoading]);

  if (isError) {
    return (
      <Redirect to={`${admin}/not-found`} />
    );
  }

  const getCurrentStage = (): Stage | null => {
    if (collectionStages.length === 0) {
      return null
    }

    const currentStageIndex = collectionStages.findIndex(({stage}: Stage) => stage.name === data["_workflow_stage"])

    return collectionStages[currentStageIndex] || null
  }

  const currentStage = getCurrentStage();
  const collectionPermissions = permissions?.collections?.[slug];
  const apiURL = `${serverURL}${api}/${slug}/${id}${collection.versions.drafts ? '?draft=true' : ''}`;
  const action = `${serverURL}${api}/${slug}${isEditing ? `/${id}` : ''}?locale=${locale}&depth=0&fallback-locale=null`;
  const hasStagePermission = !collection.workflow || userRoles.some((role: string) => role === currentStage?.stage?.approver || role === 'admin')
  const hasSavePermission = (isEditing && collectionPermissions?.update?.permission) || (!isEditing && collectionPermissions?.create?.permission);

  return (
    <NegativeFieldGutterProvider allow>
      <RenderCustomComponent
        DefaultComponent={DefaultEdit}
        CustomComponent={CustomEdit}
        componentProps={{
          isLoading,
          data: dataToRender,
          collection,
          permissions: collectionPermissions,
          isEditing,
          onSave,
          initialState,
          hasStagePermission,
          hasSavePermission,
          hasWorkflow,
          apiURL,
          action,
          workflowStages: collectionStages,
          currentStage: data["_workflow_stage"],
          comments,
          addComment,
          isEditingComment,
          setIsEditingComment
        }}
      />
    </NegativeFieldGutterProvider>
  );
};
export default EditView;
