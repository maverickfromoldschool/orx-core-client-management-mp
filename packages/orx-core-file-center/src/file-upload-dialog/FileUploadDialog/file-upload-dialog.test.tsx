import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {FileUploadDialog} from './file-upload-dialog';
import {FileUploadDialogProps} from './file-upload-dialog.types';

describe('FileUploadDialog', () => {
  it('should render successfully', () => {
    const props: FileUploadDialogProps = {
      open: true,
      onClose: jest.fn(),
      onUpload: jest.fn(),
      text: 'test text'
    } as unknown as FileUploadDialogProps;

    const {baseElement, getByText} = render(<FileUploadDialog {...props} />);
    expect(baseElement).toBeTruthy();
    expect(getByText('test text')).toBeTruthy();
    expect(getByText('Select File')).toBeTruthy();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = jest.fn();
    const props: FileUploadDialogProps = {
      open: true,
      onClose,
      onUpload: jest.fn()
    } as unknown as FileUploadDialogProps;

    const {getByLabelText} = render(<FileUploadDialog {...props} />);
    const closeBtn = getByLabelText('close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalled();
  });
});
