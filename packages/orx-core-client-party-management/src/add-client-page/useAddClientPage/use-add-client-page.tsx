import React from 'react';

export function useAddClientPage() {
  const [value, setValue] = React.useState('AddClientPage');

  React.useEffect(() => {
    setValue('AddClientPage Updated');
  }, []);

  return {
    value
  };
}

export default useAddClientPage;
