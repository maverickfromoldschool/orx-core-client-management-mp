import React from 'react';

export function useProductDetailsPage() {
  const [value, setValue] = React.useState('ProductDetailsPage');

  React.useEffect(() => {
    setValue('ProductDetailsPage Updated');
  }, []);

  return {
    value
  };
}

export default useProductDetailsPage;
