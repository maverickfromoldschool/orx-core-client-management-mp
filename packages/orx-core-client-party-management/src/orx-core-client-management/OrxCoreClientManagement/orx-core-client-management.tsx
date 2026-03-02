'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import {BreadcrumbsContextProvider} from '@optum-rx-core/orx-core-client-shared';

import {OrxCoreClientManagementProvider} from '../../orx-core-client-management-provider/OrxCoreClientManagementProvider/orx-core-client-management-provider';
import {useOrxCoreClientManagement} from '../useOrxCoreClientManagement/use-orx-core-client-management';
import {Router} from '../../router/Router/router';

import {OrxCoreClientManagementProps} from './orx-core-client-management.types';

export const OrxCoreClientManagement = React.forwardRef<HTMLDivElement, OrxCoreClientManagementProps>((props, ref) => {
  const {setRef} = props;
  const hookProps = useOrxCoreClientManagement({ref: ref as React.RefObject<HTMLDivElement>});

  return (
    <Grid container ref={setRef}>
      <OrxCoreClientManagementProvider {...props} {...hookProps}>
        <BreadcrumbsContextProvider setBreadcrumbs={props.setBreadcrumbs}>
          <Grid item xs={12}>
            <Router />
          </Grid>
        </BreadcrumbsContextProvider>
      </OrxCoreClientManagementProvider>
    </Grid>
  );
});

export default OrxCoreClientManagement;
