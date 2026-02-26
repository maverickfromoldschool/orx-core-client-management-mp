import React from 'react';

export function useProductViewPage() {
  const [value, setValue] = React.useState('ProductViewPage');

  React.useEffect(() => {
    setValue('ProductViewPage Updated');
  }, []);

  return {
    value
  };
}

export default useProductViewPage;
