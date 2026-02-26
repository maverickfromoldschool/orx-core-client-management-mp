import React from 'react';

export function useUnitOfMeasurePage() {
  const [value, setValue] = React.useState('UnitOfMeasurePage');

  React.useEffect(() => {
    setValue('UnitOfMeasurePage Updated');
  }, []);

  return {
    value
  };
}

export default useUnitOfMeasurePage;
