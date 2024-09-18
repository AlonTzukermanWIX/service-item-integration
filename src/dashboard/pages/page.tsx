import React from 'react';
import { withDashboard } from '@wix/dashboard-react';
import { WixDesignSystemProvider } from '@wix/design-system';
import JewelsAppRouter from '../../components/patterns/JewelsAppRouter';
import '@wix/design-system/styles.global.css';

function Index() {
  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <JewelsAppRouter />
    </WixDesignSystemProvider>
  );
}

export default withDashboard(Index);
