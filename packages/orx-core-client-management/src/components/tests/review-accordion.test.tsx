import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import {ReviewAccordion} from '../review-accordion';

describe('ReviewAccordion', () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
  });

  it('should render title and subtitle', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" onEdit={mockOnEdit}>
        <div>Content</div>
      </ReviewAccordion>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" onEdit={mockOnEdit}>
        <div>Test Content</div>
      </ReviewAccordion>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" onEdit={mockOnEdit}>
        <div>Content</div>
      </ReviewAccordion>
    );

    const editButton = screen.getByRole('button', {name: /edit/i});
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should render edit icon button', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" onEdit={mockOnEdit}>
        <div>Content</div>
      </ReviewAccordion>
    );

    const editButton = screen.getByRole('button', {name: /edit/i});
    expect(editButton).toBeInTheDocument();
  });

  it('should render expand/collapse icon', () => {
    const {container} = render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" onEdit={mockOnEdit}>
        <div>Content</div>
      </ReviewAccordion>
    );

    const expandIcon = container.querySelector('svg[data-testid="ExpandMoreIcon"]');
    expect(expandIcon).toBeInTheDocument();
  });

  it('should be expanded by default when defaultExpanded is true', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" defaultExpanded onEdit={mockOnEdit}>
        <div>Test Content</div>
      </ReviewAccordion>
    );

    // Content should be visible
    expect(screen.getByText('Test Content')).toBeVisible();
  });

  it('should toggle accordion when clicked', () => {
    render(
      <ReviewAccordion title="Test Title" subtitle="Test Subtitle" defaultExpanded={false} onEdit={mockOnEdit}>
        <div>Test Content</div>
      </ReviewAccordion>
    );

    // Click to expand using the accordion summary (not the edit button)
    const accordionSummary = screen.getByText('Test Subtitle').closest('[role="button"]');
    if (accordionSummary) {
      fireEvent.click(accordionSummary);
    }

    expect(screen.getByText('Test Content')).toBeVisible();
  });
});
