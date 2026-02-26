'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import {OrxCoreProductsProvider} from '../../orx-core-products-provider/OrxCoreProductsProvider/orx-core-products-provider';
import {useOrxCoreProducts} from '../useOrxCoreProducts/use-orx-core-products';
import {Router} from '../../router/Router/router';

import {OrxCoreProductsProps} from './orx-core-products.types';

export const OrxCoreProducts = React.forwardRef<HTMLDivElement, OrxCoreProductsProps>((props, ref) => {
  const {setRef} = props;
  const hookProps = useOrxCoreProducts({ref: ref as React.RefObject<HTMLDivElement>});

  return (
    <Grid container ref={setRef}>
      <OrxCoreProductsProvider {...props} {...hookProps}>
        <Box
          sx={{
            width: '100%',
            height: '100vh'
          }}
        >
          <Router />
        </Box>
      </OrxCoreProductsProvider>
    </Grid>
  );
});

export default OrxCoreProducts;
