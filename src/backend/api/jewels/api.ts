import {
  deleteDataFromCollection,
  getDataFromCollection,
  safelyGetItemFromCollection,
  upsertDataToCollection,
} from "../../database";
import { NEW_COLLECTION_ID } from "../../consts";
import { NewJewel } from "../../../types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  let entityId = url.searchParams.get("id");
  if (entityId) {
    const data = await safelyGetItemFromCollection({
      itemId: entityId,
      dataCollectionId: NEW_COLLECTION_ID,
    });
    return new Response(JSON.stringify(data));
  }

  const jewelsCollection = await getDataFromCollection({
    dataCollectionId: NEW_COLLECTION_ID,
    query: url.searchParams,
  });

  console.log({ items: jewelsCollection.items });
  return new Response(JSON.stringify(jewelsCollection.items));
}

export async function POST(req: Request) {
  const { jewel } = (await req.json()) as { jewel: NewJewel };

  try {
    await upsertDataToCollection({
      dataCollectionId: NEW_COLLECTION_ID,
      item: {
        _id: jewel.id,
        data: jewel,
      },
    });

    return new Response("Success");
  } catch (error) {
    return new Response("Failed", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { jewels } = (await req.json()) as { jewels: NewJewel[] };

  try {
    await deleteDataFromCollection({
      dataCollectionId: NEW_COLLECTION_ID,
      itemIds: jewels.map((jewel) => jewel.id),
    });

    return new Response("Success");
  } catch (error) {
    return new Response("Failed", { status: 500 });
  }
}
