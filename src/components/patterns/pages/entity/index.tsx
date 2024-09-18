import React from 'react';
import { EntityPage } from '@wix/patterns';
import { useJewelEntityPage, useJewelEntityPageHeader } from './hooks';
import { Form } from './EntityPageForm';
import { Card } from '@wix/design-system';

export const JewelEntityPage = () => {
  const { state, entity } = useJewelEntityPage();
  const header = useJewelEntityPageHeader({ entity });

  return (
    <EntityPage state={state} dataHook='demo-entity-page'>
      {header}
      <EntityPage.Content>
        <EntityPage.MainContent>
          <Form />
        </EntityPage.MainContent>
        <EntityPage.AdditionalContent>
          <Card></Card>
        </EntityPage.AdditionalContent>
      </EntityPage.Content>
    </EntityPage>
  );
};

const Cerification = () => {
  return (
    <>
      <Card.Header title='Certification' />
      <Card.Divider />
      <Card.Content></Card.Content>
    </>
  );
};
