import React from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "@wix/essentials";
import {
  CollectionOptimisticActions,
  CollectionToolbarFilters,
  CursorQuery,
  CustomColumns,
  dateRangeFilter,
  DateRangeFilter,
  Filter,
  idNameArrayFilter,
  MoreActions,
  MultiBulkActionToolbar,
  MultiSelectCheckboxFilter,
  OffsetQuery,
  PrimaryActions,
  RangeItem,
  stringsArrayFilter,
  Table,
  TableColumn,
  TableState,
  TabsFilter,
  useOptimisticActions,
  useStaticListFilterCollection,
  useTableCollection,
} from "@wix/patterns";
import { CollectionPage } from "@wix/patterns/page";
import {
  Add,
  Delete,
  Edit,
  InvoiceSmall,
  Visible,
} from "@wix/wix-ui-icons-common";
import { type Jewel } from "../../../../types";
import { type DataItem } from "../../../../backend/database";
import { Text } from "@wix/design-system";

export type TableFilters = {
  colors: Filter<string[]>;
  collections: Filter<string[]>;
  available: Filter<{ id: string; name: string }[]>;
};

export const useJewelsPageState = () => {
  const fetchDataHandler = async ({
    search,
    filters,
    sort,
  }: OffsetQuery<Partial<TableFilters>>) => {
    //TODO: handle query and filters
    console.log(search, filters, sort);

    let queryParams = {};
    if (search) {
      queryParams = { ...queryParams, q: search };
    }
    if (filters.colors) {
      queryParams = { ...queryParams, colors: filters.colors.join(",") };
    }
    if (filters.collections) {
      queryParams = { ...queryParams, colors: filters.collections.join(",") };
    }
    if (filters.available) {
      queryParams = {
        ...queryParams,
        available: filters.available.map(({ id }) => id),
      };
    }

    const res = await httpClient.fetchWithAuth(
      `${import.meta.env.BASE_API_URL}/jewels?${new URLSearchParams(
        queryParams
      ).toString()}`
    );
    const data: DataItem[] = await res.json();
    return {
      items: data.map((item) => item.data) || [],
      cursor: "", //TODO: handle cursor
    };
  };

  const state = useTableCollection<Jewel, TableFilters>({
    queryName: "dummy-entity-table",
    fqdn: "wix.patterns.dummyservice.v1.dummy_entity",
    itemKey: (item) => item.id,
    itemName: (item) => item.title,
    fetchData: fetchDataHandler,
    fetchErrorMessage: ({ err }) => `Error: ${err}`,
    filters: {
      colors: stringsArrayFilter(),
      collections: stringsArrayFilter(),
      available: idNameArrayFilter(),
    },
  });

  const optimisticActions = useOptimisticActions(state.collection);

  return {
    state,
    optimisticActions,
  };
};

export const useJewelsPageHeader = ({
  state,
  optimisticActions,
}: {
  state: TableState<Jewel, TableFilters>;
  optimisticActions: CollectionOptimisticActions<Jewel, TableFilters>;
}) => {
  const moreActionsItems = useMoreActionsItems();

  const createItem = async () => {
    const item = {
      title: "Random jewel" + Math.random(),
      amount: Math.floor(Math.random() * 100),
      jewel: "necklace",
      id: Math.random().toString(36).substring(7).toString(),
    };

    optimisticActions.createOne(item, {
      submit: async ([itemToSubmit]) => {
        const res = await addJewel(itemToSubmit);
        const { data }: { data: Jewel } = await res.json();
        return [data];
      },
      successToast: "Jewel created successfully",
    });
  };

  return (
    <CollectionPage.Header
      title={{ text: "Dummy Collection", hideTotal: true }}
      subtitle={{
        text: "This is a dummy collection subtitle",
        learnMore: { url: "https://www.wix.com" },
      }}
      moreActions={<MoreActions items={moreActionsItems} />}
      primaryAction={
        <PrimaryActions label="Add" prefixIcon={<Add />} onClick={createItem} />
      }
    />
  );
};

export const useJewelsPageContent = ({
  state,
  optimisticActions,
}: {
  state: TableState<Jewel, TableFilters>;
  optimisticActions: CollectionOptimisticActions<Jewel, TableFilters>;
}) => {
  const navigate = useNavigate();

  const colorsCollection = useStaticListFilterCollection(
    state.collection.filters.colors,
    ["Red", "Green", "Blue", "Yellow", "Purple"]
  );

  const collectionsCollection = useStaticListFilterCollection(
    state.collection.filters.collections,
    [
      "Collection 1",
      "Collection 2",
      "Collection 3",
      "Collection 4",
      "Collection 5",
    ]
  );

  return (
    <CollectionPage.Content>
      <Table
        dataHook="dummy-entity-collection"
        useNewInfiniteScrollLoader
        horizontalScroll={true}
        showSelection
        state={state}
        customColumns={<CustomColumns />}
        tabs={
          <TabsFilter
            filter={state.collection.filters.available}
            data={[
              { id: "available", name: "Available" },
              { id: "notAvailable", name: "notAvailable" },
            ]}
            all="All Items"
          />
        }
        filters={
          <CollectionToolbarFilters inline={0}>
            <MultiSelectCheckboxFilter
              accordionItemProps={{ label: "Colors" }}
              popoverProps={{ appendTo: "window" }}
              filter={state.collection.filters.colors}
              collection={colorsCollection}
              renderItem={(color) => ({ title: color })}
            />
            <MultiSelectCheckboxFilter
              accordionItemProps={{ label: "Collections" }}
              popoverProps={{ appendTo: "window" }}
              filter={state.collection.filters.collections}
              collection={collectionsCollection}
              renderItem={(collection) => ({ title: collection })}
            />
          </CollectionToolbarFilters>
        }
        bulkActionToolbar={({ selectedValues, openConfirmModal }) => (
          <MultiBulkActionToolbar
            secondaryActionItems={[
              {
                label: "Delete",
                prefixIcon: <Delete />,
                onClick: async () => {
                  openConfirmModal({
                    primaryButtonOnClick: async () => {
                      optimisticActions.deleteMany(selectedValues, {
                        submit: async (itemsToDelete) => {
                          await deleteJewels(itemsToDelete);
                        },
                        successToast: "Jewels deleted successfully",
                      });
                    },
                    content: (
                      <Text>
                        You're about to delete the{" "}
                        <b>{`${selectedValues.length} items`}</b>.
                      </Text>
                    ),
                    theme: "destructive",
                  });
                },
              },
            ]}
          />
        )}
        actionCell={(item, _index, api) => {
          return {
            primaryAction: {
              text: "Edit",
              onClick: () => {
                navigate(`/${item.id}`);
              },
              icon: <Edit />,
            },
            secondaryActions: [
              {
                dataHook: "collection-delete-action",
                text: "Delete",
                icon: <Delete />,
                onClick: () => {
                  api.openConfirmDeleteModal({
                    primaryButtonOnClick: () => {
                      optimisticActions.deleteOne(item, {
                        submit: async ([itemToDelete]) => {
                          await deleteJewels([itemToDelete]);
                        },
                        successToast: "Jewel deleted successfully",
                      });
                    },
                  });
                },
              },
            ],
          };
        }}
        columns={getJewelsTableColumns()}
      />
    </CollectionPage.Content>
  );
};

const useMoreActionsItems = () => {
  const navigate = useNavigate();
  return [
    [
      {
        biName: "action-1",
        text: "Do Action #1",
        prefixIcon: <InvoiceSmall />,
        onClick: () => {
          navigate("/entity");
        },
      },
      {
        biName: "action-2",
        text: "Another Action #2",
        prefixIcon: <Visible />,
        onClick: () => {
          console.log("Open Subscriptions");
        },
      },
    ],
  ];
};

const getJewelsTableColumns = () => {
  return [
    {
      id: "title",
      hideable: false,
      title: "Title",
      render: (item: Jewel) => item.title,
    },
    {
      id: "amount",
      hideable: false,
      title: "Amount",
      render: (item: Jewel) => item.amount,
    },
    {
      id: "jewel",
      hideable: false,
      title: "Jewel type",
      render: (item: Jewel) => item.jewel,
    },
  ] as TableColumn<Jewel>[];
};

const addJewel = async (item: Jewel) =>
  await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/jewels`, {
    method: "POST",
    body: JSON.stringify({
      jewel: item,
    }),
  });

const deleteJewels = async (jewels: Jewel[]) =>
  await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/jewels`, {
    method: "DELETE",
    body: JSON.stringify({
      jewels,
    }),
  });
