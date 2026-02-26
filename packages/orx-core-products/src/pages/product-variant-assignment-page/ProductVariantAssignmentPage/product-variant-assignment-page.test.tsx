import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import {ProductVariantAssignmentPage} from './product-variant-assignment-page';
import {ProductVariantAssignmentPageProps} from './product-variant-assignment-page.types';

describe('ProductVariantAssignmentPage', () => {
  it('should render successfully', () => {
    const props: ProductVariantAssignmentPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(
      <BrowserRouter>
        <ProductVariantAssignmentPage {...props} />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
