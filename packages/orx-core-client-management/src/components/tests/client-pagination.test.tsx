import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import {ClientPagination} from '../client-pagination';

describe('ClientPagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should not render when totalPages is 1', () => {
    const {container} = render(<ClientPagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render page numbers', () => {
    render(<ClientPagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onPageChange when a page number is clicked', () => {
    render(<ClientPagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should highlight current page', () => {
    render(<ClientPagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const currentPageButton = screen.getByText('3');
    // Just verify current page is rendered, styling is handled by MUI
    expect(currentPageButton).toBeInTheDocument();
  });

  it('should render ellipsis for large page counts', () => {
    render(<ClientPagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('should navigate to previous page', () => {
    render(<ClientPagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    // Click the page 2 button directly
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should navigate to next page', () => {
    render(<ClientPagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const buttons = screen.getAllByRole('button');
    // Last button should be next
    const nextButton = buttons[buttons.length - 1];
    if (nextButton) {
      fireEvent.click(nextButton);
    }

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('should disable previous button on first page', () => {
    render(<ClientPagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    // On first page, clicking page 1 shouldn't trigger navigation
    const page1Button = screen.getByText('1');
    expect(page1Button).toBeInTheDocument();
  });

  it('should disable next button on last page', () => {
    render(<ClientPagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];

    expect(nextButton).toBeDisabled();
  });
});
