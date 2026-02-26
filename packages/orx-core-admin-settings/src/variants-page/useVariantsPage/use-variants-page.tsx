import React from 'react';

export function useVariantsPage() {
  const [value, setValue] = React.useState('VariantsPage');

  React.useEffect(() => {
    setValue('VariantsPage Updated');
  }, []);

  return {
    value
  };
}

export default useVariantsPage;
