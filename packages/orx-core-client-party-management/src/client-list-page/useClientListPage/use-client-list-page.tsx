import React from 'react';

export function useClientListPage() {
  const [value, setValue] = React.useState('ClientListPage');

  React.useEffect(() => {
    setValue('ClientListPage Updated');
  }, []);

  return {
    value
  };
}

export default useClientListPage;
