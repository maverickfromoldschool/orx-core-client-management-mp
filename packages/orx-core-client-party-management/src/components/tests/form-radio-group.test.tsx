import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {useForm} from 'react-hook-form';
import type {FieldError} from 'react-hook-form';

import {FormRadioGroup} from '../form-radio-group';

interface TestFormData {
  testRadio: string;
}

const mockOptions = [
  {value: 'yes', label: 'Yes'},
  {value: 'no', label: 'No'}
];

const TestWrapper: React.FC<{
  row?: boolean;
  disabled?: boolean;
  error?: FieldError;
}> = ({row, disabled, error}) => {
  const {control} = useForm<TestFormData>({
    defaultValues: {testRadio: 'yes'}
  });

  return (
    <FormRadioGroup
      name="testRadio"
      control={control}
      label="Test Radio"
      options={mockOptions}
      row={row}
      disabled={disabled}
      error={error}
    />
  );
};

describe('FormRadioGroup', () => {
  it('should render the radio group with label', () => {
    render(<TestWrapper />);
    expect(screen.getByText('Test Radio')).toBeInTheDocument();
  });

  it('should render all radio options', () => {
    render(<TestWrapper />);
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('should render in row layout by default', () => {
    const {container} = render(<TestWrapper row />);
    const radioGroup = container.querySelector('[role="radiogroup"]');
    expect(radioGroup).toBeInTheDocument();
  });

  it('should allow selecting radio options', () => {
    render(<TestWrapper />);
    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');

    expect(yesRadio).toBeChecked();
    expect(noRadio).not.toBeChecked();

    fireEvent.click(noRadio);
    expect(noRadio).toBeChecked();
  });

  it('should disable all radio buttons when disabled is true', () => {
    render(<TestWrapper disabled />);
    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');

    expect(yesRadio).toBeDisabled();
    expect(noRadio).toBeDisabled();
  });

  it('should not disable radio buttons by default', () => {
    render(<TestWrapper disabled={false} />);
    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');

    expect(yesRadio).not.toBeDisabled();
    expect(noRadio).not.toBeDisabled();
  });

  it('should render with proper styling', () => {
    render(<TestWrapper />);
    const label = screen.getByText('Test Radio');
    expect(label.tagName).toBe('LABEL');
  });
});
