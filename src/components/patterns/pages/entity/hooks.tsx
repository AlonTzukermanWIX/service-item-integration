import React from 'react';
import { EntityPage, useEntity, useEntityPage } from '@wix/patterns';
import { Breadcrumbs } from '@wix/design-system';

import { useForm } from '@wix/patterns/form';
import { NewJewel } from '../../../../types';
import { useParams } from 'react-router-dom';
import { httpClient } from '@wix/essentials';

import { useNavigate } from 'react-router-dom';

export type EntityPageFormFields = {
  name: string;
  sku: string;
  mainImage: string;
  price: number;
  details: string;
  color: string;
  certification: string;
  category: string;
  availability: boolean;
};

export const useJewelEntityPage = () => {
  const params = useParams();
  const form = useForm<EntityPageFormFields>();
  const navigate = useNavigate();

  const state = useEntityPage<NewJewel, EntityPageFormFields>({
    parentPath: '/',
    parentPageId: '',
    form,
    onSave: async (data) => {
      // // TODO: save the entity
      const id = params.entityId ?? 'some random id' + Math.random();
      const formValues = form.getValues();
      const newItem = { ...formValues, _id: id, id };
      await httpClient.fetchWithAuth(
        `${import.meta.env.BASE_API_URL}/jewels?id=${params.entityId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            jewel: newItem,
          }),
        }
      );
      navigate('/');
      return new Promise((resolve) => resolve({ updatedEntity: newItem }));
    },
    saveSuccessToast: 'Successfully saved',
    saveErrorToast: (e) => 'Failed to save',
    fetch: async () => {
      // TODO: Load the entity you want to show in the page
      console.log({ params });
      const res = await httpClient.fetchWithAuth(
        `${import.meta.env.BASE_API_URL}/jewels?id=${params.entityId}`
      );
      const entity = (await res.json()) as NewJewel;
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
  entity: NewJewel | null;
}) => {
  const navigate = useNavigate();
  return (
    <EntityPage.Header
      title={{ text: entity?.name || 'New Entity' }}
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
