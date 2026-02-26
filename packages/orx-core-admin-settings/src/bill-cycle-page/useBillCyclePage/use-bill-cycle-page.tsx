import React from 'react';

export function useBillCyclePage() {
  const [value, setValue] = React.useState('BillCyclePage');

  React.useEffect(() => {
    setValue('BillCyclePage Updated');
  }, []);

  return {
    value
  };
}

export default useBillCyclePage;
