import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, waitFor} from '@testing-library/react';
import {createTheme} from '@mui/material';

import {ApplicationWrapper} from './application-wrapper';
import {ApplicationWrapperProps} from './application-wrapper.types';

const mockTheme = createTheme();
jest.mock('@optum-rx-skyline/themes', () => ({
  useCheckTheme: jest.fn().mockImplementation(() => ({theme: mockTheme, error: new Error('test error')}))
}));

describe('ApplicationWrapper', () => {
  it('should render successfully', () => {
    const props: ApplicationWrapperProps = {
      container: document.createElement('div'),
      text: 'orx-core-file-center'
    };
    const {baseElement} = render(<ApplicationWrapper {...props} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with a different theme', () => {
    const props: ApplicationWrapperProps = {
      container: document.createElement('div'),
      theme: 'optumTheme',
      text: 'orx-core-file-center'
    };
    const {baseElement} = render(<ApplicationWrapper {...props} />);
    expect(baseElement).toBeTruthy();
  });

  it('should catch errors loading theme properly', async () => {
    const errorEvent = jest.fn();
    const props: ApplicationWrapperProps = {
      container: document.createElement('div'),
      theme: 'wrongTheme',
      text: 'orx-core-file-center',
      errorAction: errorEvent
    };
    const {baseElement} = render(<ApplicationWrapper {...props} />);
    expect(baseElement).toBeTruthy();
    await waitFor(() => {
      expect(errorEvent).toHaveBeenCalled();
    });
  });
});
