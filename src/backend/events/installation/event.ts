import { auth } from '@wix/essentials';
import { collections } from '@wix/data';
import { appInstances } from '@wix/app-management';
import { JEWELRY_COLLECTION_ID, NEW_COLLECTION_ID } from '../../consts';

appInstances.onAppInstanceInstalled(() => {
  auth.elevate(collections.createDataCollection)({
    _id: NEW_COLLECTION_ID,
    displayName: 'New app collection',
    fields: [
      { key: 'name', type: collections.Type.TEXT },
      { key: 'sku', type: collections.Type.TEXT },
      { key: 'mainImage', type: collections.Type.IMAGE },
      { key: 'price', type: collections.Type.NUMBER },
      { key: 'details', type: collections.Type.RICH_TEXT },
      { key: 'color', type: collections.Type.TEXT },
      { key: 'certification', type: collections.Type.TEXT },
      { key: 'category', type: collections.Type.TEXT },
    ],
    permissions: {
      //TODO: Make sure to change the permissions according to the actual usage of your collection
      insert: collections.Role.ANYONE,
      read: collections.Role.ANYONE,
      remove: collections.Role.ANYONE,
      update: collections.Role.ANYONE,
    },
  });
  // auth.elevate(collections.createDataCollection)({
  //   _id: JEWELRY_COLLECTION_ID,
  //   displayName: 'Jewelry',
  //   fields: [
  //     { key: 'title', type: collections.Type.TEXT },
  //     { key: 'amount', type: collections.Type.NUMBER },
  //     { key: 'jewelry', type: collections.Type.TEXT },
  //   ],
  //   permissions: {
  //     //TODO: Make sure to change the permissions according to the actual usage of your collection
  //     insert: collections.Role.ANYONE,
  //     read: collections.Role.ANYONE,
  //     remove: collections.Role.ANYONE,
  //     update: collections.Role.ANYONE,
  //   },
  // });
  //TODO: Add initial data to the collection
});
