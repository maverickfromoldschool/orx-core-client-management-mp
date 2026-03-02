import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import {SuccessBanner} from '../success-banner';

describe('SuccessBanner', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    mockOnDismiss.mockClear();
  });

  it('should render when visible is true', () => {
    render(<SuccessBanner message="Operation successful" visible onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('should not render when visible is false', () => {
    render(<SuccessBanner message="Operation successful" visible={false} onDismiss={mockOnDismiss} />);

    expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
  });

  it('should display the provided message', () => {
    const testMessage = 'Test success message';
    render(<SuccessBanner message={testMessage} visible onDismiss={mockOnDismiss} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    render(<SuccessBanner message="Operation successful" visible onDismiss={mockOnDismiss} />);

    const dismissButton = screen.getByLabelText('dismiss');
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('should render with success severity styling', () => {
    render(<SuccessBanner message="Success" visible onDismiss={mockOnDismiss} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should render CheckCircleOutlineIcon', () => {
    const {container} = render(<SuccessBanner message="Success" visible onDismiss={mockOnDismiss} />);

    const icon = container.querySelector('svg[data-testid="CheckCircleOutlineIcon"]');
    expect(icon).toBeInTheDocument();
  });

  it('should render CloseIcon for dismiss button', () => {
    const {container} = render(<SuccessBanner message="Success" visible onDismiss={mockOnDismiss} />);

    const closeIcon = container.querySelector('svg[data-testid="CloseIcon"]');
    expect(closeIcon).toBeInTheDocument();
  });
});
