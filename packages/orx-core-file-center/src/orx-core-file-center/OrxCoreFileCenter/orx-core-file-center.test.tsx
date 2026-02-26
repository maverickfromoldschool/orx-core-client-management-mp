import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {OrxCoreFileCenter} from './orx-core-file-center';
import {OrxCoreFileCenterProps} from './orx-core-file-center.types';

describe('OrxCoreFileCenter', () => {
  it('should render successfully', () => {
    const props: OrxCoreFileCenterProps = {
      setRef: jest.fn(),
      text: 'test text'
    };
    const {baseElement} = render(<OrxCoreFileCenter {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
