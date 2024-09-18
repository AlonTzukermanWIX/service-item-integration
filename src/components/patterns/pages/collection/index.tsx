import React from "react";
import { CollectionPage } from "@wix/patterns/page";
import {
  useJewelsPageContent,
  useJewelsPageHeader,
  useJewelsPageState,
} from "./hooks";

export const JewelsCollectionPage = () => {
  const { state } = useJewelsPageState();
  const collectionPageHeader = useJewelsPageHeader();
  const collectionPageContent = useJewelsPageContent(state);
  return (
    <CollectionPage dataHook="dummy-collection-page">
      {collectionPageHeader}
      {collectionPageContent}
    </CollectionPage>
  );
};
