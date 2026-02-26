import React from 'react';

export function usePriceListEntryDetailsPage() {
  const [value, setValue] = React.useState('PriceListEntryDetailsPage');

  React.useEffect(() => {
    setValue('PriceListEntryDetailsPage Updated');
  }, []);

  return {
    value
  };
}

export default usePriceListEntryDetailsPage;
