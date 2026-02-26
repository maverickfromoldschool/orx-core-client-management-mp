import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {useLookupExtensionPage} from '../useLookupExtensionPage/use-lookup-extension-page';

import {LookupExtensionPage} from './lookup-extension-page';
import {LookupExtensionPageProps} from './lookup-extension-page.types';

jest.mock('../useLookupExtensionPage/use-lookup-extension-page', () => ({
  useLookupExtensionPage: jest.fn()
}));

describe('LookupExtensionPage', () => {
  it('should render successfully', () => {
    // mock the hook
    (useLookupExtensionPage as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      value: 'test value'
    });

    const props: LookupExtensionPageProps = {
      text: 'test text'
    };
    const {baseElement, getByText} = render(<LookupExtensionPage {...props} />);
    expect(baseElement).toBeTruthy();
    expect(getByText('test text')).toBeTruthy();
    expect(getByText('test value')).toBeTruthy();
  });

  it('should change value on Click', () => {
    const onClick = jest.fn();
    // mock the hook
    (useLookupExtensionPage as jest.Mock).mockReturnValue({
      onClick,
      value: 'test value'
    });
    const props: LookupExtensionPageProps = {
      text: 'test text'
    };

    const {getByRole} = render(<LookupExtensionPage {...props} />);
    getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
});
