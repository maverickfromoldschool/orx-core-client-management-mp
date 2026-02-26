import React from 'react';
import {render, screen} from '@testing-library/react';

import {Router} from './router';

// Mock the LookupPage component
jest.mock('../../lookup-page/LookupPage/lookup-page', () => ({
  LookupPage: () => <div data-testid="lookup-page">Lookup Page</div>
}));

describe('Router', () => {
  const defaultProps = {
    text: 'test text'
  };

  it('should render successfully', () => {
    const {baseElement} = render(<Router {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render LookupPage', () => {
    render(<Router {...defaultProps} />);
    expect(screen.getByTestId('lookup-page')).toBeInTheDocument();
  });

  it('should handle text prop', () => {
    const {baseElement} = render(<Router text="custom text" />);
    expect(baseElement).toBeTruthy();
  });
});
