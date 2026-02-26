import React from 'react';

export function useProductListPage() {
  const [value, setValue] = React.useState('ProductListPage');

  React.useEffect(() => {
    setValue('ProductListPage Updated');
  }, []);

  return {
    value
  };
}

export default useProductListPage;
