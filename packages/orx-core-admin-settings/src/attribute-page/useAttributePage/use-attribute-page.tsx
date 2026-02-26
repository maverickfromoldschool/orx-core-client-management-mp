'use client';

import React from 'react';

import {UseAttributePageReturn} from './use-attribute-page.types';

export function useAttributePage(): UseAttributePageReturn {
  const [value, setValue] = React.useState('test value');

  function onClick() {
    setValue('new value');
  }

  return {
    value,
    onClick
  };
}

export default useAttributePage;
