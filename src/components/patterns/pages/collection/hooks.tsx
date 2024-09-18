import React from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "@wix/essentials";
import {
  CollectionToolbarFilters,
  CursorQuery,
  CustomColumns,
  dateRangeFilter,
  DateRangeFilter,
  Filter,
  MoreActions,
  PrimaryActions,
  RangeItem,
  Table,
  TableColumn,
  TableState,
  useOptimisticActions,
  useTableCollection,
} from "@wix/patterns";
import { CollectionPage } from "@wix/patterns/page";
import { Add, Edit, InvoiceSmall, Visible } from "@wix/wix-ui-icons-common";
import { type Jewel } from "../../../../types";
import { type DataItem } from "../../../../backend/database";

export type TableFilters = {
  updatedDate: Filter<RangeItem<Date>>;
};

export const useJewelsPageState = () => {
  const fetchDataHandler = async (
    _query: CursorQuery<Partial<TableFilters>>
  ) => {
    //TODO: handle query and filters
    const res = await httpClient.fetchWithAuth(
      `${import.meta.env.BASE_API_URL}/jewels`
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
      updatedDate: dateRangeFilter(),
    },
  });

  return {
    state,
  };
};

export const useJewelsPageHeader = () => {
  const moreActionsItems = useMoreActionsItems();
  return (
    <CollectionPage.Header
      title={{ text: "Dummy Collection", hideTotal: true }}
      subtitle={{
        text: "This is a dummy collection subtitle",
        learnMore: { url: "https://www.wix.com" },
      }}
      moreActions={<MoreActions items={moreActionsItems} />}
      primaryAction={
        <PrimaryActions
          label="Add"
          prefixIcon={<Add />}
          subItems={[
            {
              label: "Add random jewel",
              onClick: addJewel,
              biName: "add-random-jewel",
            },
          ]}
        />
      }
    />
  );
};

export const useJewelsPageContent = (
  state: TableState<Jewel, TableFilters>
) => {
  const optimisticActions = useOptimisticActions(state.collection);

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
    <CollectionPage.Content>
      <Table
        useNewInfiniteScrollLoader
        horizontalScroll={true}
        dataHook="dummy-entity-collection"
        state={state}
        customColumns={<CustomColumns />}
        filters={
          <CollectionToolbarFilters>
            <DateRangeFilter
              accordionItemProps={{ label: "Date" }}
              filter={state.collection.filters.updatedDate}
            />
          </CollectionToolbarFilters>
        }
        actionCell={(_item) => {
          return {
            primaryAction: {
              text: "Edit",
              onClick: () => {
                console.log("Edit");
              },
              icon: <Edit />,
            },
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
