'use client';

import React from 'react';

import {UseAssignCagListProps, UseAssignCagListReturn} from './use-assign-cag-list.types';

export function useAssignCagList(props: UseAssignCagListProps): UseAssignCagListReturn {
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

export default useAssignCagList;
