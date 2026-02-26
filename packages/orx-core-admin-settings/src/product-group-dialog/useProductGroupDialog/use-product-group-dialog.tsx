'use client';

import React from 'react';

import {UseProductGroupDialogProps, UseProductGroupDialogReturn} from './use-product-group-dialog.types';

export function useProductGroupDialog(props: UseProductGroupDialogProps): UseProductGroupDialogReturn {
  const {text} = props;
  const [value, setValue] = React.useState(text ?? '');

  function onClick() {
    setValue('new value');
  }

  return {
    value,
    onClick
  };
}

export default useProductGroupDialog;
