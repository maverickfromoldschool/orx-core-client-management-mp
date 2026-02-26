## Integrate into a NextJS application
```
/* eslint-disable no-console */
import React from 'react';
import {useRouter} from 'next/router';
import {OrxCorePricingEvent} from 'New Package/orx-core-pricing';

import {UseOrxCorePricingRefReturn} from './use-orx-core-pricing-ref.types';

export function useOrxCorePricingRef(): UseOrxCorePricingRefReturn {
  const {push} = useRouter();
  const ref = React.useRef<HTMLDivElement | null>(null);

  function onEvent(e: CustomEvent<OrxCorePricingEvent>) {
    const {detail} = e;
    console.log('event', detail.type, detail.payload);

    // eslint-disable-next-line default-case
    switch (detail.type) {
      case ROUTE_EVENT.TYPE:
        push(detail.payload.href);
        break;
      case ANALYTICS_EVENT.TYPE:
        if (window.trackAnalytics) {
          window.trackAnalytics(detail.payload);
        }
      case ERROR_EVENT.TYPE:
        if (window.handleError) {
          window.handleError(detail.payload);
        }
    }
  }

  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
      ref.current.removeEventListener('event', onEvent as EventListener);
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
      node.addEventListener('event', onEvent as EventListener);
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return {
    setRef,
    ref,
    onEvent
  };
}

export default useOrxCorePricingRef;
```