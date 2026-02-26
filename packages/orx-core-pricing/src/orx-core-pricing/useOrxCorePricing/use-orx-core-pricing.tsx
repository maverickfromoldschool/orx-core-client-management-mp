import {useClickLink} from '../../useClickLink/use-click-link';

import {UseOrxCorePricingProps, UseOrxCorePricingReturn} from './use-orx-core-pricing.types';

export function useOrxCorePricing(props: UseOrxCorePricingProps): UseOrxCorePricingReturn {
  const {ref} = props;
  const {onClickLink} = useClickLink({ref});

  return {
    onClickLink
  };
}

export default useOrxCorePricing;
