import React from 'react';

export function usePriceListDetailsPage() {
  const [value, setValue] = React.useState('PriceListDetailsPage');

  React.useEffect(() => {
    setValue('PriceListDetailsPage Updated');
  }, []);

  return {
    value
  };
}

export default usePriceListDetailsPage;
