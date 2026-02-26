import {useClickLink} from '../../useClickLink/use-click-link';

import {UseOrxCoreFileCenterProps, UseOrxCoreFileCenterReturn} from './use-orx-core-file-center.types';

export function useOrxCoreFileCenter(props: UseOrxCoreFileCenterProps): UseOrxCoreFileCenterReturn {
  const {ref} = props;
  const {onClickLink} = useClickLink({ref});

  return {
    onClickLink
  };
}

export default useOrxCoreFileCenter;
