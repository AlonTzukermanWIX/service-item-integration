import { items } from '@wix/data';
import { Jewel } from '../types';

export type DataItem = {
  _id?: string;
  data: Jewel;
};

export const getDataFromCollection = async ({
  dataCollectionId,
}: {
  dataCollectionId: string;
}) => {
  const query = items.queryDataItems({
    dataCollectionId,
  });
  return query.find();
};

export const safelyGetItemFromCollection = async ({
  dataCollectionId,
  itemId,
}: {
  dataCollectionId: string;
  itemId: string;
}) => {
  try {
    const { data } = await items.getDataItem(itemId, { dataCollectionId });

    return data;
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
  const existsInCollection =
    item._id &&
    collection.items.find((existingItem) => existingItem._id === item._id);

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
};
