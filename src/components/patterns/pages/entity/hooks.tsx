import React from 'react';
import { EntityPage, useEntity, useEntityPage } from '@wix/patterns';
import { Breadcrumbs } from '@wix/design-system';

import { useForm } from '@wix/patterns/form';
import { Jewel } from '../../../../types';
import { useParams } from 'react-router-dom';
import { httpClient } from '@wix/essentials';

import { useNavigate } from 'react-router-dom';

export type EntityPageFormFields = {
  name: string;
  updatedDate: Date;
  createdDate: Date;
};

export const useJewelEntityPage = () => {
  const params = useParams();
  const form = useForm<EntityPageFormFields>();
  const navigate = useNavigate();

  const state = useEntityPage<Jewel, EntityPageFormFields>({
    parentPath: '/',
    parentPageId: '',
    form,
    onSave: async (data) => {
      const formValues = form.getValues();
      // TODO: save the entity
      navigate('/');
      return await new Promise((resolve) =>
        resolve({ updatedEntity: {} as Jewel })
      );
    },
    saveSuccessToast: 'Successfully saved',
    saveErrorToast: (e) => 'Failed to save',
    fetch: async () => {
      // TODO: Load the entity you want to show in the page
      const res = await httpClient.fetchWithAuth(
        `${import.meta.env.BASE_API_URL}/jewels?id=${params.entityId}`
      );
      const entity = (await res.json()) as Jewel;
      return { entity };
    },
  });
  const entity = useEntity(state);

  return {
    state,
    entity,
  };
};

export const useJewelEntityPageHeader = ({
  entity,
}: {
  entity: Jewel | null;
}) => {
  const navigate = useNavigate();
  return (
    <EntityPage.Header
      title={{ text: entity?.title || 'New Entity' }}
      subtitle={
        entity
          ? {
              text: `Jewel ID: ${entity.id}`,
              learnMore: {
                url: 'https://www.wix.com/',
              },
            }
          : undefined
      }
      breadcrumbs={
        <Breadcrumbs
          activeId='current'
          items={[
            { id: 'root', value: 'Dummy Entity Collection' },
            { id: 'current', value: 'Entity Page' },
          ]}
          onClick={(e) => {
            if (e.id === 'root') {
              navigate('/');
            }
          }}
        />
      }
    />
  );
};
