'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import {BreadcrumbsContextProvider} from '@optum-rx-core/orx-core-client-shared';

import {Router} from '../../router/Router/router';

import {OrxCoreAdminSettingsProps} from './orx-core-admin-settings.types';

export const OrxCoreAdminSettings = React.forwardRef<HTMLDivElement, OrxCoreAdminSettingsProps>((props) => {
  const {setRef} = props;

  return (
    <Grid container ref={setRef}>
      <BreadcrumbsContextProvider setBreadcrumbs={props.setBreadcrumbs}>
        <Grid item xs={12}>
          <Router />
        </Grid>
      </BreadcrumbsContextProvider>
    </Grid>
  );
});

OrxCoreAdminSettings.displayName = 'OrxCoreAdminSettings';

export default OrxCoreAdminSettings;
