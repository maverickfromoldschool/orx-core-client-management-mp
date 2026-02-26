import {useClickLink} from '../../useClickLink/use-click-link';

import {UseOrxCoreProductsProps, UseOrxCoreProductsReturn} from './use-orx-core-products.types';

export function useOrxCoreProducts(props: UseOrxCoreProductsProps): UseOrxCoreProductsReturn {
  const {ref} = props;
  const {onClickLink} = useClickLink({ref});

  return {
    onClickLink
  };
}

export default useOrxCoreProducts;
