'use client';

import React from 'react';

import {UseFileCenterHomeProps, UseFileCenterHomeReturn} from './use-file-center-home.types';

export function useFileCenterHome(props: UseFileCenterHomeProps): UseFileCenterHomeReturn {
  const {title} = props;
  const [value, setValue] = React.useState(title || '');

  function onClick() {
    setValue('new value');
  }

  return {
    value,
    onClick
  };
}

export default useFileCenterHome;
