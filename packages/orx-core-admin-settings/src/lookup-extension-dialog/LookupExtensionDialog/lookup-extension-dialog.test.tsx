import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {useLookupExtensionDialog} from '../useLookupExtensionDialog/use-lookup-extension-dialog';

import {LookupExtensionDialog} from './lookup-extension-dialog';
import {LookupExtensionDialogProps} from './lookup-extension-dialog.types';

jest.mock('../useLookupExtensionDialog/use-lookup-extension-dialog', () => ({
  useLookupExtensionDialog: jest.fn()
}));

describe('LookupExtensionDialog', () => {
  it('should render successfully', () => {
    // mock the hook
    (useLookupExtensionDialog as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      value: 'test value'
    });

    const props: LookupExtensionDialogProps = {
      text: 'test text'
    };
    const {baseElement, getByText} = render(<LookupExtensionDialog {...props} />);
    expect(baseElement).toBeTruthy();
    expect(getByText('test text')).toBeTruthy();
    expect(getByText('test value')).toBeTruthy();
  });

  it('should change value on Click', () => {
    const onClick = jest.fn();
    // mock the hook
    (useLookupExtensionDialog as jest.Mock).mockReturnValue({
      onClick,
      value: 'test value'
    });
    const props: LookupExtensionDialogProps = {
      text: 'test text'
    };

    const {getByRole} = render(<LookupExtensionDialog {...props} />);
    getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
});
