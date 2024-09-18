import React from 'react';

import { EntityPage } from '@wix/patterns';
import {
  useJewelEntityPage,
  useJewelEntityPageContent,
  useJewelEntityPageHeader,
} from './hooks';

export const JewelEntityPage = () => {
  const { state, entity } = useJewelEntityPage();
  const jewelEntityPageHeader = useJewelEntityPageHeader({ entity });
  const jewelEntityPageContent = useJewelEntityPageContent({ entity });
  return (
    <EntityPage state={state} dataHook='demo-entity-page'>
      {jewelEntityPageHeader}
      {jewelEntityPageContent}
    </EntityPage>
  );
};
