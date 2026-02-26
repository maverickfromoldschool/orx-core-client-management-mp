import {getEvent} from '../events';

import {
  ANALYTICS_EVENT,
  AnalyticsEventPayload,
  UseAnalyticsEventProps,
  UseAnalyticsEventReturn
} from './use-analytics-event.types';

export function useAnalyticsEvent(props: UseAnalyticsEventProps): UseAnalyticsEventReturn {
  const {ref} = props;

  return {
    dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => {
      if (ref.current) {
        ref.current.dispatchEvent(getEvent({type: ANALYTICS_EVENT.TYPE, payload}));
      }
    }
  };
}

export default useAnalyticsEvent;
