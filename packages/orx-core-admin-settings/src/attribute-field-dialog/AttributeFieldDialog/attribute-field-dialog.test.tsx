import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {AttributeFieldDialog} from './attribute-field-dialog';
import {AttributeFieldDialogProps} from './attribute-field-dialog.types';

describe('AttributeFieldDialog', () => {
  const defaultProps: AttributeFieldDialogProps = {
    open: true,
    attribute: null,
    onClose: jest.fn(),
    onSave: jest.fn(),
    dataTypeOptions: [{label: 'String', value: 'string'}],
    fieldTypeOptions: [{label: 'Text', value: 'text'}],
    entityOptions: [{label: 'Client', value: 'client'}],
    lookupsLoading: false
  };

  it('should render successfully', () => {
    const {baseElement} = render(
      <NotificationProvider>
        <AttributeFieldDialog {...defaultProps} />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should call onClose when Cancel is clicked', () => {
    const onClose = jest.fn();
    const props = {...defaultProps, onClose};

    const {getByText} = render(
      <NotificationProvider>
        <AttributeFieldDialog {...props} />
      </NotificationProvider>
    );
    const cancelButton = getByText('Cancel');
    cancelButton.click();
    expect(onClose).toHaveBeenCalled();
  });
});
