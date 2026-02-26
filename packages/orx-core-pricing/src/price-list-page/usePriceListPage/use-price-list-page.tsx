import React from 'react';

export function usePriceListPage() {
  const [value, setValue] = React.useState('PriceListPage');

  React.useEffect(() => {
    setValue('PriceListPage Updated');
  }, []);

  return {
    value
  };
}

export default usePriceListPage;
