import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {Router} from './router';
import {RouterProps} from './router.types';

describe('Router', () => {
  it('should render successfully', () => {
    const props: RouterProps = {
      text: 'test text'
    };
    const {baseElement} = render(<Router {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
