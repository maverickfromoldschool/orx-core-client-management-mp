import React from 'react';
import {render} from '@testing-library/react';

import {OrxCoreAdminSettings} from './orx-core-admin-settings';

describe('OrxCoreAdminSettings', () => {
  const defaultProps = {
    text: 'test text'
  };

  it('should render successfully', () => {
    const {baseElement} = render(<OrxCoreAdminSettings {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('should handle text prop', () => {
    const {baseElement} = render(<OrxCoreAdminSettings text="custom text" />);
    expect(baseElement).toBeTruthy();
  });
});
