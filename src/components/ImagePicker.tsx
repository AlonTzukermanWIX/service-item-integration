import { useDashboard } from '@wix/dashboard-react';
import { ImageViewer } from '@wix/design-system';
import React from 'react';
import { useState } from 'react';

export const ImagePicker = ({
  setImage,
  src,
  width,
  height,
  ref,
}: {
  setImage: (img: string) => void;
  src?: string;
  width?: string;
  height?: string;
  ref?: any;
}) => {
  const dashboard = useDashboard();
  return (
    <ImageViewer
      //   onRemoveImage={() => setSrc('')}
      imageUrl={src}
      ref={ref}
      width={width || '100%'}
      height={height || '100%'}
      onAddImage={async () => {
        const chosenMediaItems = await dashboard.openMediaManager({
          multiSelect: true,
        });
        if (chosenMediaItems?.items[0].url) {
          setImage(chosenMediaItems.items[0].url);
        }
      }}
    />
  );
};
