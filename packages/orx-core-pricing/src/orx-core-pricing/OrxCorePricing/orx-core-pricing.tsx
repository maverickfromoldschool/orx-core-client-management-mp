'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import {BreadcrumbsContextProvider} from '@optum-rx-core/orx-core-client-shared';

import {Router} from '../../router/Router/router';

import {OrxCorePricingProps} from './orx-core-pricing.types';

export const OrxCorePricing = React.forwardRef<HTMLDivElement, OrxCorePricingProps>((props) => {
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

OrxCorePricing.displayName = 'OrxCorePricing';

export default OrxCorePricing;
