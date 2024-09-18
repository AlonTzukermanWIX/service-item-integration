import React from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '@wix/essentials';
import {
  CollectionOptimisticActions,
  CollectionToolbarFilters,
  CustomColumns,
  Filter,
  idNameArrayFilter,
  MoreActions,
  MultiBulkActionToolbar,
  MultiSelectCheckboxFilter,
  OffsetQuery,
  PrimaryActions,
  stringsArrayFilter,
  Table,
  TableColumn,
  TableState,
  useOptimisticActions,
  useStaticListFilterCollection,
  useTableCollection,
} from '@wix/patterns';
import { type NewJewel } from '../../../../types';
import { type DataItem } from '../../../../backend/database';
import { CollectionPage } from '@wix/patterns/page';
import {
  Add,
  Delete,
  Edit,
  InvoiceSmall,
  Visible,
} from '@wix/wix-ui-icons-common';
import { Box, Checkbox, Image, Text, ToggleSwitch } from '@wix/design-system';

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

    let queryParams = {};
    if (search) {
      queryParams = { ...queryParams, q: search };
    }
    if (filters.colors) {
      queryParams = { ...queryParams, colors: filters.colors.join(',') };
    }
    if (filters.collections) {
      queryParams = { ...queryParams, colors: filters.collections.join(',') };
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
      total: 0, //TODO: handle cursor
    };
  };

  const state = useTableCollection<NewJewel, TableFilters>({
    queryName: 'dummy-entity-table',
    fqdn: 'wix.patterns.dummyservice.v1.dummy_entity',
    itemKey: (item) => item.id,
    itemName: (item) => item.name,
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
  state: TableState<NewJewel, TableFilters>;
  optimisticActions: CollectionOptimisticActions<NewJewel, TableFilters>;
}) => {
  const moreActionsItems = useMoreActionsItems();

  const createItem = async () => {
    const item = {
      name: 'New Jewel',
      sku: 'SKU',
      mainImage: 'https://via.placeholder.com/150',
      price: 0,
      details: 'Details',
      color: 'Red',
      certification: 'Certification',
      category: 'Category',
      availability: false,
      id: '',
    };

    optimisticActions.createOne(item, {
      submit: async ([itemToSubmit]) => {
        const res = await addJewel(itemToSubmit);
        const { data }: { data: NewJewel } = await res.json();
        return [data];
      },
      successToast: 'Jewel created successfully',
    });
  };

  return (
    <CollectionPage.Header
      title={{ text: 'Dummy Collection', hideTotal: true }}
      subtitle={{
        text: 'This is a dummy collection subtitle',
        learnMore: { url: 'https://www.wix.com' },
      }}
      moreActions={<MoreActions items={moreActionsItems} />}
      primaryAction={
        <PrimaryActions label='Add' prefixIcon={<Add />} onClick={createItem} />
      }
    />
  );
};

export const useJewelsPageContent = ({
  state,
  optimisticActions,
}: {
  state: TableState<NewJewel, TableFilters>;
  optimisticActions: CollectionOptimisticActions<NewJewel, TableFilters>;
}) => {
  const navigate = useNavigate();

  const colorsCollection = useStaticListFilterCollection(
    state.collection.filters.colors,
    ['Red', 'Green', 'Blue', 'Yellow', 'Purple']
  );

  const collectionsCollection = useStaticListFilterCollection(
    state.collection.filters.collections,
    [
      'Collection 1',
      'Collection 2',
      'Collection 3',
      'Collection 4',
      'Collection 5',
    ]
  );

  const availableCollection = useStaticListFilterCollection(
    state.collection.filters.available,
    [
      { id: 'available', name: 'Available' },
      { id: 'not-available', name: 'Not Available' },
    ]
  );

  return (
    <CollectionPage.Content>
      <Table
        dataHook='dummy-entity-collection'
        useNewInfiniteScrollLoader
        horizontalScroll={true}
        showSelection
        state={state}
        customColumns={<CustomColumns />}
        rowVerticalPadding='small'
        filters={
          <CollectionToolbarFilters inline={1}>
            <MultiSelectCheckboxFilter
              accordionItemProps={{ label: 'In Stock' }}
              popoverProps={{ appendTo: 'window' }}
              filter={state.collection.filters.available}
              collection={availableCollection}
              renderItem={(available) => ({ title: available.name })}
            />
            <MultiSelectCheckboxFilter
              accordionItemProps={{ label: 'Colors' }}
              popoverProps={{ appendTo: 'window' }}
              filter={state.collection.filters.colors}
              collection={colorsCollection}
              renderItem={(color) => ({ title: color })}
            />
            <MultiSelectCheckboxFilter
              accordionItemProps={{ label: 'Collections' }}
              popoverProps={{ appendTo: 'window' }}
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
                label: 'Delete',
                prefixIcon: <Delete />,
                onClick: async () => {
                  openConfirmModal({
                    primaryButtonOnClick: async () => {
                      optimisticActions.deleteMany(selectedValues, {
                        submit: async (itemsToDelete) => {
                          await deleteJewels(itemsToDelete);
                        },
                        successToast: 'Jewels deleted successfully',
                      });
                    },
                    content: (
                      <Text>
                        You're about to delete the{' '}
                        <b>{`${selectedValues.length} items`}</b>.
                      </Text>
                    ),
                    theme: 'destructive',
                  });
                },
              },
            ]}
          />
        )}
        actionCell={(item, _index, api) => {
          return {
            primaryAction: {
              text: 'Edit',
              onClick: () => {
                navigate(`/${item.id ?? item._id}`);
              },
              icon: <Edit />,
            },
            secondaryActions: [
              {
                dataHook: 'collection-delete-action',
                text: 'Delete',
                icon: <Delete />,
                onClick: () => {
                  api.openConfirmDeleteModal({
                    primaryButtonOnClick: () => {
                      optimisticActions.deleteOne(item, {
                        submit: async ([itemToDelete]) => {
                          await deleteJewels([itemToDelete]);
                        },
                        successToast: 'Jewel deleted successfully',
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
        biName: 'action-1',
        text: 'Do Action #1',
        prefixIcon: <InvoiceSmall />,
        onClick: () => {
          navigate('/8aq86w');
        },
      },
      {
        biName: 'action-2',
        text: 'Another Action #2',
        prefixIcon: <Visible />,
        onClick: () => {
          console.log('Open Subscriptions');
        },
      },
    ],
  ];
};

const getJewelsTableColumns = () => {
  return [
    {
      id: 'product',
      hideable: false,
      title: 'Product',
      width: '60px',
      render: (item: NewJewel) => {
        return <Image height='42px' width='60px' src={item.mainImage} />;
      },
    },
    {
      id: 'name',
      hideable: false,
      width: '200px',
      render: (item: NewJewel) => (
        <Box direction='vertical' gap='3px'>
          <Text weight='normal'>{item.name}</Text>
          <Text size='small' secondary>
            {`SKU: ${item.sku}`}
          </Text>
        </Box>
      ),
    },
    {
      id: 'category',
      title: 'Category',
      width: '100px',
      render: (item: NewJewel) => item.category,
    },
    {
      id: 'price',
      title: 'Price',
      width: '100px',
      render: (item: NewJewel) => `$${item.price}`,
    },
    {
      id: 'details',
      title: 'Details',
      width: '200px',
      render: (item: NewJewel) => item.details,
    },
    {
      id: 'certification',
      title: 'Certification',
      width: '100px',
      render: (item: NewJewel) => item.certification,
    },
    {
      id: 'availability',
      title: 'Availability',
      width: '100px',
      render: (item: NewJewel) => (
        <Box verticalAlign='middle' gap='SP2'>
          <Checkbox checked={item.availability} />
        </Box>
      ),
    },
  ] as TableColumn<NewJewel>[];
};

const addJewel = async (item: NewJewel) =>
  await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/jewels`, {
    method: 'POST',
    body: JSON.stringify({
      jewel: item,
    }),
  });

const deleteJewels = async (jewels: NewJewel[]) =>
  await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/jewels`, {
    method: 'DELETE',
    body: JSON.stringify({
      jewels,
    }),
  });
