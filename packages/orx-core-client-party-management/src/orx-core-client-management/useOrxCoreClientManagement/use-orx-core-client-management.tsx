import {useClickLink} from '../../useClickLink/use-click-link';

import {
  UseOrxCoreClientManagementProps,
  UseOrxCoreClientManagementReturn
} from './use-orx-core-client-management.types';

export function useOrxCoreClientManagement(props: UseOrxCoreClientManagementProps): UseOrxCoreClientManagementReturn {
  const {ref} = props;
  const {onClickLink} = useClickLink({ref});

  return {
    onClickLink
  };
}

export default useOrxCoreClientManagement;
