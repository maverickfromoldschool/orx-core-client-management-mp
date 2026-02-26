import React from 'react';

export function useProductVariantAssignmentPage() {
  const [value, setValue] = React.useState('ProductVariantAssignmentPage');

  React.useEffect(() => {
    setValue('ProductVariantAssignmentPage Updated');
  }, []);

  return {
    value
  };
}

export default useProductVariantAssignmentPage;
