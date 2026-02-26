## Integrate into a NextJS application
```
/* eslint-disable no-console */
import React from 'react';
import {useRouter} from 'next/router';
import {OrxCoreProductsEvent} from 'New Package/orx-core-products';

import {UseOrxCoreProductsRefReturn} from './use-orx-core-products-ref.types';

export function useOrxCoreProductsRef(): UseOrxCoreProductsRefReturn {
  const {push} = useRouter();
  const ref = React.useRef<HTMLDivElement | null>(null);

  function onEvent(e: CustomEvent<OrxCoreProductsEvent>) {
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

export default useOrxCoreProductsRef;
```