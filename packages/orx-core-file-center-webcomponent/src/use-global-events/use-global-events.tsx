import React from 'react';
import {
  OrxCoreFileCenterEvent,
  ROUTE_EVENT,
  ANALYTICS_EVENT,
  ERROR_EVENT,
  RouteEventPayload,
  AnalyticsEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-file-center';

/**
 * Type definition for the route action function.
 */
type RouteAction = (e: RouteEventPayload) => void;

/**
 * Type definition for the analytics action function.
 */
type AnalyticsAction = (e: AnalyticsEventPayload) => void;

/**
 * Type definition for the error action function.
 */
type ErrorAction = (e: ErrorEventPayload) => void;

/**
 * Props for the GlobalEvents component.
 */
export interface GlobalEventsProps {
  ref: React.RefObject<HTMLDivElement>;
  routeAction?: RouteAction;
  analyticsAction?: AnalyticsAction;
  errorAction?: ErrorAction;
}

/**
 * Handles the event based on the event type.
 * @param e - The CustomEvent object.
 * @param actions - The actions object.
 */
export function handleEvent(
  e: CustomEvent<OrxCoreFileCenterEvent>,
  actions: {
    routeAction?: RouteAction;
    analyticsAction?: AnalyticsAction;
    errorAction?: ErrorAction;
  }
) {
  const {detail} = e;
  const {type, payload} = detail;
  const {routeAction, analyticsAction, errorAction} = actions;

  // eslint-disable-next-line default-case
  switch (type) {
    case ROUTE_EVENT.TYPE:
      routeAction?.(payload);
      break;
    case ANALYTICS_EVENT.TYPE:
      analyticsAction?.(payload);
      break;
    case ERROR_EVENT.TYPE:
      errorAction?.(payload);
      break;
  }
}

/**
 * Adds an event listener to the specified element.
 * @param elem - The HTMLDivElement to add the event listener to.
 * @param callback - The event listener callback function.
 */
export function addEventListener(elem: HTMLDivElement | null, callback: EventListener) {
  elem?.addEventListener('event', callback);
}

/**
 * Removes an event listener from the specified element.
 * @param elem - The HTMLDivElement to remove the event listener from.
 * @param callback - The event listener callback function.
 */
export function removeEventListener(elem: HTMLDivElement | null, callback: EventListener) {
  elem?.removeEventListener('event', callback);
}

/**
 * Custom hook that adds global event listeners to the specified element.
 * @param props - The GlobalEventsProps object.
 * @param _handleEvent - The handleEvent function (optional).
 */
export function useGlobalEvents(props: GlobalEventsProps, _handleEvent = handleEvent) {
  const {ref, routeAction, analyticsAction, errorAction} = props;

  const onEvent = (e: CustomEvent<OrxCoreFileCenterEvent>) => {
    const actions = {routeAction, analyticsAction, errorAction};
    _handleEvent(e, actions);
  };

  React.useEffect(() => {
    addEventListener(ref.current, onEvent as EventListener);
    return () => {
      removeEventListener(ref.current, onEvent as EventListener);
    };
  }, [ref.current]);
}

export default useGlobalEvents;
