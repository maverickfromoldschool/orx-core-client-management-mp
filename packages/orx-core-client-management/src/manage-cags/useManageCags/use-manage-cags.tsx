import React from 'react';

export function useManageCags() {
  const [value, setValue] = React.useState('ManageCags');

  React.useEffect(() => {
    setValue('ManageCags Updated');
  }, []);

  return {
    value
  };
}

export default useManageCags;
