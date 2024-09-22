import React, { useEffect } from 'react';
import { CollectionPage } from '@wix/patterns/page';
import {
  useJewelsPageContent,
  useJewelsPageHeader,
  useJewelsPageState,
} from './hooks';

export const JewelsCollectionPage = () => {
  const { state, optimisticActions } = useJewelsPageState();

  const collectionPageHeader = useJewelsPageHeader({
    state,
    optimisticActions,
  });

  const collectionPageContent = useJewelsPageContent({
    state,
    optimisticActions,
  });

  useEffect(() => {
    state.collection.refreshCurrentPage();
  }, []);

  return (
    <CollectionPage dataHook='dummy-collection-page'>
      {collectionPageHeader}
      {collectionPageContent}
    </CollectionPage>
  );
};
