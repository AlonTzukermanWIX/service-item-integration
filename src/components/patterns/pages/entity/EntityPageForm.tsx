import React from 'react';
import { EntityPage, useEntityPageContext } from '@wix/patterns';
import {
  Box,
  Card,
  Cell,
  ColorPicker,
  FormField,
  Input,
  Layout,
  RichTextInputArea,
  ToggleSwitch,
} from '@wix/design-system';
import { Jewel } from '../../../../types';
import { Controller, useController } from '@wix/patterns/form';
import { EntityPageFormFields } from './hooks';
import { ImagePicker } from '../../../ImagePicker';
import { Dropdown } from '@wix/design-system';
import { Currency } from '@wix/wix-ui-icons-common';

export const MainForm = () => {
  const {
    entity,
    form: { control },
  } = useEntityPageContext<Jewel, EntityPageFormFields>();

  const name = useController({
    name: 'name',
    control,
    defaultValue: entity?.title,
    rules: { required: { value: true, message: 'The field is required' } },
  });
  const price = useController({
    name: 'price',
    control,
    defaultValue: entity?.price,
    rules: { required: { value: true, message: 'The field is required' } },
  });
  const mainImage = useController({
    name: 'mainImage',
    control,
    defaultValue: entity?.mainImage,
  });
  const details = useController({
    name: 'details',
    control,
    defaultValue: entity?.details,
  });
  const color = useController({
    name: 'color',
    control,
    defaultValue: entity?.color,
  });
  return (
    <>
      <EntityPage.Card>
        <Card.Header
          title='Product info'
          subtitle='General information about the product'
        />
        <Card.Divider />
        <Card.Content>
          <Layout>
            <Cell span={6}>
              <FormField
                label='Name'
                status={name.fieldState.invalid ? 'error' : undefined}
                statusMessage={name.fieldState.error?.message}
              >
                <Input
                  dataHook='name-input'
                  inputRef={name.field.ref}
                  value={name.field.value}
                  onChange={name.field.onChange}
                  onBlur={name.field.onBlur}
                />
              </FormField>
            </Cell>
            <Cell span={6}>
              <Controller
                control={control}
                name='updatedDate'
                defaultValue={entity?.updatedDate}
                rules={{
                  validate: (value?: Date) => {
                    return value?.getDay() !== 6
                      ? true
                      : `${value.toLocaleString('en', {
                          weekday: 'long',
                        })} is a non-working day, please choose a different day.`;
                  },
                }}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { invalid, error },
                }) => (
                  <FormField
                    label='SKU'
                    status={invalid ? 'error' : undefined}
                    statusMessage={error?.message}
                    inputWidth='100%'
                  >
                    <Input
                      dataHook='sku-input'
                      inputRef={ref}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  </FormField>
                )}
              />
            </Cell>
            <Cell span={6}>
              <FormField
                label='Price'
                status={price.fieldState.invalid ? 'error' : undefined}
                statusMessage={price.fieldState.error?.message}
              >
                <Input
                  dataHook='price-input'
                  inputRef={price.field.ref}
                  value={price.field.value}
                  onChange={price.field.onChange}
                  onBlur={price.field.onBlur}
                  prefix={<Currency />}
                />
              </FormField>
            </Cell>
            <Cell span={12}>
              <FormField
                label='Main image'
                status={mainImage.fieldState.invalid ? 'error' : undefined}
                statusMessage={mainImage.fieldState.error?.message}
                inputWidth='100%'
              >
                <ImagePicker
                  setImage={(e) => {
                    console.log(e);
                    mainImage.field.onChange(e);
                  }}
                  onBlur={mainImage.field.onBlur}
                  src={mainImage.field.value}
                  ref={mainImage.field.ref}
                />
              </FormField>
            </Cell>
            <Cell span={12}>
              <FormField
                label='Details'
                status={details.fieldState.invalid ? 'error' : undefined}
                statusMessage={details.fieldState.error?.message}
                inputWidth='100%'
              >
                <RichTextInputArea
                  initialValue={details.field.value}
                  onChange={details.field.onChange}
                  onBlur={details.field.onBlur}
                />
              </FormField>
            </Cell>
          </Layout>
        </Card.Content>
      </EntityPage.Card>
      <EntityPage.Card>
        <Card.Header title='Colors' />
        <Card.Divider />
        <Card.Content>
          <Layout>
            <Cell span={6}>
              <FormField
                status={name.fieldState.invalid ? 'error' : undefined}
                statusMessage={name.fieldState.error?.message}
              >
                <ColorPicker
                  value={color.field.value}
                  onChange={color.field.onChange}
                />
              </FormField>
            </Cell>
          </Layout>
        </Card.Content>
      </EntityPage.Card>
    </>
  );
};

export const Cerification = () => {
  const {
    entity,
    form: { control },
  } = useEntityPageContext<Jewel, EntityPageFormFields>();
  const cert = useController({
    name: 'certification',
    control,
    defaultValue: entity?.certification,
    rules: { required: { value: true, message: 'The field is required' } },
  });
  const options = [
    { id: 'GIA', value: 'GIA' },
    { id: 'IGI', value: 'IGI' },
    { id: 'HRD', value: 'HRD' },
  ];
  return (
    <>
      <Card.Header title='Certification' />
      <Card.Divider />
      <Card.Content>
        <FormField
          status={cert.fieldState.invalid ? 'error' : undefined}
          statusMessage={cert.fieldState.error?.message}
          inputWidth='100%'
        >
          <Dropdown selectedId={options[0].id} options={options} />
        </FormField>
      </Card.Content>
    </>
  );
};

export const Availability = () => {
  const {
    entity,
    form: { control },
  } = useEntityPageContext<Jewel, EntityPageFormFields>();
  const availability = useController({
    name: 'availability',
    control,
    defaultValue: entity?.availability,
  });

  return (
    <>
      <Card.Header title='Availability' />
      <Card.Divider />
      <Card.Content>
        <Box>
          <FormField
            label='Visible on your site'
            labelPlacement='left'
            status={availability.fieldState.invalid ? 'error' : undefined}
            statusMessage={availability.fieldState.error?.message}
          >
            <ToggleSwitch
              size='small'
              checked={availability.field.value}
              onChange={availability.field.onChange}
            />
          </FormField>
        </Box>
      </Card.Content>
    </>
  );
};

export const JewelCategory = () => {
  const {
    entity,
    form: { control },
  } = useEntityPageContext<Jewel, EntityPageFormFields>();
  const category = useController({
    name: 'category',
    control,
    defaultValue: entity?.category,
  });

  const options = [
    { id: 'best-sellers', value: 'Best Sellers' },
    { id: 'rings', value: 'Rings' },
    { id: 'necklaces', value: 'Necklaces' },
    { id: 'earrings', value: 'Earrings' },
    { id: 'bracelets', value: 'Bracelets' },
    { id: 'pendants', value: 'Pendants' },
    { id: 'charms', value: 'Charms' },
  ];
  return (
    <>
      <Card.Header title='Category' />
      <Card.Divider />
      <Card.Content>
        <FormField
          status={category.fieldState.invalid ? 'error' : undefined}
          statusMessage={category.fieldState.error?.message}
          inputWidth='100%'
        >
          <Dropdown selectedId={options[0].id} options={options} />
        </FormField>
      </Card.Content>
    </>
  );
};
