'use client';

import React from 'react';

import {UseAttributeFieldDialogReturn} from './use-attribute-field-dialog.types';

export function useAttributeFieldDialog(): UseAttributeFieldDialogReturn {
  const [value, setValue] = React.useState('test value');

  function onClick() {
    setValue('new value');
  }

  return {
    value,
    onClick
  };
}

export default useAttributeFieldDialog;
