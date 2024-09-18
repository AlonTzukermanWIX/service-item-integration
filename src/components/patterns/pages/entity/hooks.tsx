import React from 'react';
import {
  EntityPage,
  MoreActions,
  useEntity,
  useEntityPage,
} from '@wix/patterns';
import { Breadcrumbs, Card } from '@wix/design-system';
import { InvoiceSmall } from '@wix/wix-ui-icons-common';
import { useParams } from 'react-router-dom';
import { httpClient } from '@wix/essentials';
import { useForm } from '@wix/patterns/form';
import { Jewel } from '../../../../types';

type EntityPageFormFields = {
  name: string;
  updatedDate: Date;
  createdDate: Date;
};

export const useJewelEntityPage = () => {
  const params = useParams();
  const form = useForm<EntityPageFormFields>();
  const state = useEntityPage<Jewel, EntityPageFormFields>({
    parentPath: '/entities',
    parentPageId: 'entities',
    form,
    onSave: async (data) => {
      const formValues = form.getValues();
      // TODO: save the entity
      return new Promise((resolve) => resolve({ updatedEntity: {} as Jewel }));
    },
    saveSuccessToast: 'Successfully saved',
    saveErrorToast: (e) => 'Failed to save',
    fetch: async () => {
      // TODO: Load the entity you want to show in the page
      const res = await httpClient.fetchWithAuth(
        `${import.meta.env.BASE_API_URL}/jewels?id=${
          params.entityId ?? 'm9l0wp'
        }`
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
              console.log('Navigate to collection');
            }
          }}
        />
      }
      moreActions={
        <MoreActions
          containerId='f150c9a9-ea35-4906-977f-49eeb27b080e'
          items={[
            [
              {
                biName: 'open-subscriptions',
                text: 'Open Subscriptions',
                prefixIcon: <InvoiceSmall />,
                onClick: () => {
                  console.log('Open Subscriptions');
                },
              },
            ],
          ]}
        />
      }
    />
  );
};
export const useJewelEntityPageContent = ({
  entity,
}: {
  entity: Jewel | null;
}) => {
  return (
    <EntityPage.Content>
      <EntityPage.MainContent>
        <EntityPage.Card minHeight='204px' dataHook='entity-page-card'>
          <Card.Header
            title='Main Data'
            subtitle='General information about the product'
          />
          <Card.Divider />
          <Card.Content>dataaa</Card.Content>
        </EntityPage.Card>
      </EntityPage.MainContent>
    </EntityPage.Content>
  );
};
