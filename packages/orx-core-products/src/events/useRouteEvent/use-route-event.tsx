import {getEvent} from '../events';

import {ROUTE_EVENT, RouteEventPayload, UseRouteEventProps, UseRouteEventReturn} from './use-route-event.types';

export function useRouteEvent(props: UseRouteEventProps): UseRouteEventReturn {
  const {ref} = props;

  return {
    dispatchRouteEvent: (payload: RouteEventPayload) => {
      if (ref.current) {
        ref.current.dispatchEvent(getEvent({type: ROUTE_EVENT.TYPE, payload}));
      }
    }
  };
}

export default useRouteEvent;
