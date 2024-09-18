import React from 'react';
import { EntityPage } from '@wix/patterns';
import { useJewelEntityPage, useJewelEntityPageHeader } from './hooks';
import {
  Availability,
  Cerification,
  MainForm,
  JewelCategory,
} from './EntityPageForm';
import { Card } from '@wix/design-system';

export const JewelEntityPage = () => {
  const { state, entity } = useJewelEntityPage();
  const header = useJewelEntityPageHeader({ entity });

  return (
    <EntityPage state={state} dataHook='demo-entity-page'>
      {header}
      <EntityPage.Content>
        <EntityPage.MainContent>
          <MainForm />
        </EntityPage.MainContent>
        <EntityPage.AdditionalContent>
          <Card>
            <Availability />
          </Card>
          <Card>
            <Cerification />
          </Card>
          <Card>
            <JewelCategory />
          </Card>
        </EntityPage.AdditionalContent>
      </EntityPage.Content>
    </EntityPage>
  );
};
