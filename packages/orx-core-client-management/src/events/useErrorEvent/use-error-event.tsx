import {getEvent} from '../events';

import {ERROR_EVENT, ErrorEventPayload, UseErrorEventProps, UseErrorEventReturn} from './use-error-event.types';

export function useErrorEvent(props: UseErrorEventProps): UseErrorEventReturn {
  const {ref} = props;

  return {
    dispatchErrorEvent: (payload: ErrorEventPayload) => {
      if (ref.current) {
        ref.current.dispatchEvent(getEvent({type: ERROR_EVENT.TYPE, payload}));
      }
    }
  };
}

export default useErrorEvent;
