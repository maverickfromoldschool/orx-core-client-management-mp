## OrxCoreClientManagementWebcomponent Web Component

This library packages the `@optum-rx-core/orx-core-client-management` micro-product as a webcomponent.  The web component is deployed to an Azure Storage Container and exposed to the public via an Azure content delivery network. Refer to the README.md file in the project root for more info on configuring Azure deployments.  A webcomponent uses a shadow DOM which separates the elements inside it from the parent page it is loaded in.  This allows us to do things like load a React based micro-product inside of an Angular application or inside a React application with incompatible dependencies.

## Usage

Add the custom HTML element and a script tag to initialize it.

```js
  <orx-core-client-management id="orx-core-client-management" text="Hello World" />
  <script src="http://path/to/cdn/file.umd.js"></script>
```

To use the custom HTML element in a NextJS page use this method.
```js
import Script from 'next/script';
import React from 'react';

export default function Home() {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleEvent = (e: CustomEvent<any>) => {
    // eslint-disable-next-line no-console
    console.log('event', e);
  };

  React.useEffect(() => {
    let elem: HTMLDivElement;
    if (ref.current) {
      elem = ref.current;
      elem.addEventListener('event', handleEvent as EventListener);
    }
    return () => {
      if (elem) {
        elem.removeEventListener('event', handleEvent as EventListener);
      }
    };
  }, [ref]);

  return (
    <div>
      <Script src="http://127.0.0.1:4173/orx-core-client-management.umd.js" strategy="afterInteractive" />
      <orx-core-client-management ref={ref} id="orx-core-client-management" text="Home Web Component" />
    </div>
  );
}
```
When integrating the custom web components in the surface, you may encounter TypeScript errors indicating that the custom element isn't recognized as a valid HTML element. This is a common issue when using custom elements in TypeScript.

To resolve this, you need to extend the TypeScript JSX namespace with your custom element. Below is a code snippet that demonstrates how to do this

```js
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'orx-core-client-management':OrxCoreClientManagementProps;
    }
  }
}

interface OrxCoreClientManagementProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  text: string;
}
```

An even better approach is to create a new hook in the NextJS surface hooks package which provides the ref and attaches the event listeners.  This will keep your NextJS page looking clean and make the event handlers more testable.

```js
import React from 'react';
import {useRouter} from 'next/router';
import {OrxCoreClientManagementEvent, ROUTE_EVENT, ANALYTICS_EVENT, ERROR_EVENT} from '@optum-rx-core/orx-core-client-management';

import {UseOrxCoreClientManagementRefReturn} from './use-orx-core-client-management-ref.types';

export function useOrxCoreClientManagementRef(): UseOrxCoreClientManagementRefReturn {
  const ref = React.useRef<HTMLDivElement>(null);
  const {push} = useRouter();

  const handleEvent = ((e: CustomEvent<OrxCoreClientManagementEvent>) => {
    const {detail} = e;

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
  }) as EventListener;

  React.useEffect(() => {
    ref.current?.addEventListener('event', handleEvent);
    return () => {
      ref.current?.removeEventListener('event', handleEvent);
    };
  }, [ref.current]);

  return {
    ref
  };
}

export default useOrxCoreClientManagementRef;

```

## Events

The micro-product emits events on the top level DOM element in the webcomponent. All events that are emitted from the micro-product will bubble up out of the shadow DOM into the parent DOM and can be listened to.  All events use CustomEvents with strong typing on the `detail` object.  Use a switch to handle events in different ways.

```js
  const element = document.getElementById('orx-core-client-management-webcomponent');
  element.addEventListener('event', (e: CustomEvent<OrxCoreClientManagementEvent>) => {
    const {detail} = e;

    switch (detail.type) {
      case ROUTE_EVENT.TYPE:
        console.log('route event', detail.payload);
        break;
      case ANALYTICS_EVENT.TYPE:
        console.log('analytics event', detail.payload);
      case ERROR_EVENT.TYPE:
        console.log('error event', detail.payload);
    }
  });
```

## Global/Common Events

Most micro-products will emit analytics events and route events which are likely handled in the same way for every micro-product.  There are two attributes that accept a reference to a callback function exposed on the window object.  

```js

  <script>
    window.goToRoute = (routeDetails) => {
      console.log('goToRoute', routeDetails);
      window.location.href = routeDetails.path;
    };

    window.trackAnalytics = (data) => {
      console.log('trackAnalytics', data);
    };

    window.handleError = (e: CustomEvent<MyNewMpEvent>) => {
      console.log('sufrace error triggered: ', e);
    };
  </script>

  <orx-core-client-management id="orx-core-client-management-webcomponent" text="Hello World" route-action="goToRoute" analytics-action="trackAnalytics" error-action="handleError" theme="optumTheme" />
  <script src="http://path/to/cdn/file.umd.js"></script>
```

Note that if you're working in Next.JS with React, you'll need to add a check that the window object exists before adding event handlers to the window via React.useEffect:

```js
React.useEffect(() => {
  if (typeof window !== 'undefined) {
    window.goToRoute = (routeDetails) => {
      console.log('goToRoute', routeDetails);
      window.location.href = routeDetails.path;
    };

    window.trackAnalytics = (data) => {
      console.log('trackAnalytics', data);
    };

    window.handleError = (e: CustomEvent<MyNewMpEvent>) => {
      console.log('sufrace error triggered: ', e);
    };
  }
});
  ```