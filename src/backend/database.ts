import { items } from '@wix/data';
import { NewJewel } from '../types';

export type DataItem = {
  _id?: string;
  data: NewJewel;
};

export const getDataFromCollection = async ({
  dataCollectionId,
  query,
}: {
  dataCollectionId: string;
  query?: URLSearchParams;
}) => {
  let queryItems = items.queryDataItems({
    dataCollectionId,
  });

  if (query?.get('q')) {
    queryItems = queryItems.startsWith('name', query.get('q') as string);
  }

  if (query?.get('colors')) {
    queryItems = queryItems.in(
      'colors',
      query.get('colors')?.split(',') as string[]
    );
  }

  if (query?.get('collections')) {
    queryItems = queryItems.in(
      'collections',
      query.get('collections')?.split(',') as string[]
    );
  }

  if (query?.get('available')) {
    if (query.get('available') === 'available') {
      queryItems = queryItems.ne('available', 0);
    } else {
      queryItems = queryItems.eq('available', 0);
    }
  }

  const data = await queryItems.find();
  return data;
};

export const safelyGetItemFromCollection = async ({
  dataCollectionId,
  itemId,
}: {
  dataCollectionId: string;
  itemId: string;
}) => {
  try {
    const item = await items.getDataItem(itemId, { dataCollectionId });
    return item.data;
  } catch (error) {
    // Wix data's "getDataItem" API throws exception when item with id does not exist
  }
};

export const upsertDataToCollection = async ({
  dataCollectionId,
  item,
}: {
  dataCollectionId: string;
  item: DataItem;
}) => {
  const collection = await getDataFromCollection({ dataCollectionId });
  const existsInCollection = collection.items.find(
    (existingItem) => existingItem._id === item._id
  );
  console.log('existsInCollection', existsInCollection, item);
  try {
    if (item._id && existsInCollection) {
      await items.updateDataItem(item._id, {
        dataCollectionId,
        dataItem: {
          data: {
            _id: item._id,
            ...item.data,
          },
        },
      });
    } else {
      console.log('inserting');
      await items.insertDataItem({
        dataCollectionId,
        dataItem: {
          _id: item._id ?? undefined,
          data: {
            _id: item._id ?? undefined,
            ...item.data,
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteDataFromCollection = async ({
  dataCollectionId,
  itemIds,
}: {
  dataCollectionId: string;
  itemIds: string[];
}) => {
  await items.bulkRemoveDataItems({ dataCollectionId, dataItemIds: itemIds });
};
