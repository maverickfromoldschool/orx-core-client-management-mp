import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {OrxCoreClientManagement} from './orx-core-client-management';
import {OrxCoreClientManagementProps} from './orx-core-client-management.types';

describe('OrxCoreClientManagement', () => {
  it('should render successfully', () => {
    const props: OrxCoreClientManagementProps = {
      setRef: jest.fn(),
      text: 'test text'
    };
    const {baseElement} = render(<OrxCoreClientManagement {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
