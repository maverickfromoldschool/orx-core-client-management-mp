'use client';

import React from 'react';

import {UseLookupExtensionDialogProps, UseLookupExtensionDialogReturn} from './use-lookup-extension-dialog.types';

export function useLookupExtensionDialog(props: UseLookupExtensionDialogProps): UseLookupExtensionDialogReturn {
  const {text} = props;
  const [value, setValue] = React.useState(text);

  function onClick() {
    setValue('new value');
  }

  return {
    value,
    onClick
  };
}

export default useLookupExtensionDialog;
