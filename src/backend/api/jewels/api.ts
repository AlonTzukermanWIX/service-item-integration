import {
  DataItem,
  getDataFromCollection,
  upsertDataToCollection,
} from '../../database';
import { JEWELRY_COLLECTION_ID } from '../../consts';
import { Jewel } from '../../../types';

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get('id')) {
    console.log('has id');
  }
  const jewelsCollection = await getDataFromCollection({
    dataCollectionId: JEWELRY_COLLECTION_ID,
  });

  return new Response(JSON.stringify(jewelsCollection.items));
}

export async function POST(req: Request) {
  const { jewel } = (await req.json()) as { jewel: Jewel };

  try {
    await upsertDataToCollection({
      dataCollectionId: JEWELRY_COLLECTION_ID,
      item: {
        _id: jewel.id,
        data: jewel,
      },
    });

    return new Response('Success');
  } catch (error) {
    return new Response('Failed', { status: 500 });
  }
}
