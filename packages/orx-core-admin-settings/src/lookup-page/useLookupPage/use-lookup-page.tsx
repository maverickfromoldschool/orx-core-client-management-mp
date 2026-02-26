import React from 'react';

export function useLookupPage() {
  const [value, setValue] = React.useState('LookupPage');

  React.useEffect(() => {
    setValue('LookupPage Updated');
  }, []);

  return {
    value
  };
}

export default useLookupPage;
