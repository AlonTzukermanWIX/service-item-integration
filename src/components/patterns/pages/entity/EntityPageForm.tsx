import React from 'react';
import { EntityPage, useEntityPageContext } from '@wix/patterns';
import {
  Box,
  Card,
  Cell,
  DatePicker,
  FormField,
  Input,
  Layout,
  RichTextInputArea,
} from '@wix/design-system';

import { Jewel } from '../../../../types';
import { Controller, useController } from '@wix/patterns/form';
import { EntityPageFormFields } from './hooks';
import { ImagePicker } from '../../../ImagePicker';
export const Form = () => {
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
  const mainImage = useController({
    name: 'mainImage',
    control,
    defaultValue: entity?.mainImage,
    // rules: { required: { value: true, message: 'The field is required' } },
  });
  const details = useController({
    name: 'details',
    control,
    defaultValue: entity?.details,
    // rules: { required: { value: true, message: 'The field is required' } },
  });

  return (
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
  );
};
