import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';
import {
  getEvent,
  ANALYTICS_EVENT,
  ROUTE_EVENT,
  ERROR_EVENT,
  AnalyticsEventPayload,
  RouteEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-products';

import {
  useGlobalEvents,
  GlobalEventsProps,
  addEventListener,
  removeEventListener,
  handleEvent
} from './use-global-events';

describe('handleEvent', () => {
  it('should call routeAction', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});

    handleEvent(event, {routeAction, analyticsAction, errorAction});

    expect(routeAction).toHaveBeenCalledWith(payload);
    expect(analyticsAction).not.toHaveBeenCalled();
    expect(errorAction).not.toHaveBeenCalled();
  });

  it('should not call any action if routeAction not defined', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});

    handleEvent(event, {});

    expect(routeAction).not.toHaveBeenCalled();
    expect(analyticsAction).not.toHaveBeenCalled();
    expect(errorAction).not.toHaveBeenCalled();
  });

  it('should call analyticsAction', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: AnalyticsEventPayload = {category: 'test'};
    const event = getEvent({type: ANALYTICS_EVENT.TYPE, payload});

    handleEvent(event, {routeAction, analyticsAction, errorAction});

    expect(analyticsAction).toHaveBeenCalledWith(payload);
    expect(routeAction).not.toHaveBeenCalled();
    expect(errorAction).not.toHaveBeenCalled();
  });

  it('should not call any action if analyticsAction not defined', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: AnalyticsEventPayload = {category: 'test'};
    const event = getEvent({type: ANALYTICS_EVENT.TYPE, payload});

    handleEvent(event, {});

    expect(routeAction).not.toHaveBeenCalled();
    expect(analyticsAction).not.toHaveBeenCalled();
    expect(errorAction).not.toHaveBeenCalled();
  });

  it('should call errorAction', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: ErrorEventPayload = {error: new Error('test error')};
    const event = getEvent({type: ERROR_EVENT.TYPE, payload});

    handleEvent(event, {routeAction, analyticsAction, errorAction});

    expect(errorAction).toHaveBeenCalledWith(payload);
    expect(routeAction).not.toHaveBeenCalled();
    expect(analyticsAction).not.toHaveBeenCalled();
  });

  it('should not call any action if errorAction not defined', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const errorAction = jest.fn();
    const payload: ErrorEventPayload = {error: new Error('test error')};
    const event = getEvent({type: ERROR_EVENT.TYPE, payload});

    handleEvent(event, {});

    expect(routeAction).not.toHaveBeenCalled();
    expect(analyticsAction).not.toHaveBeenCalled();
    expect(errorAction).not.toHaveBeenCalled();
  });

  it('should not call any action', () => {
    const routeAction = jest.fn();
    const analyticsAction = jest.fn();
    const payload: AnalyticsEventPayload = {category: 'test'};
    const event = getEvent({type: ANALYTICS_EVENT.TYPE, payload});

    handleEvent(event, {});

    expect(analyticsAction).not.toHaveBeenCalled();
    expect(routeAction).not.toHaveBeenCalled();
  });
});

describe('useGlobalEvents', () => {
  it('should add event listener and trigger callback', () => {
    const ref = React.createRef<HTMLDivElement>();

    const callback = jest.fn();
    const props: GlobalEventsProps = {ref};
    const wrapper = ({children}: any) => <div ref={ref}>{children}</div>;
    renderHook(
      () => {
        useGlobalEvents(props, callback);
      },
      {wrapper}
    );

    // call dispatch event
    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});
    act(() => {
      ref.current?.dispatchEvent(event);
    });

    expect(callback).toHaveBeenCalledWith(event, {
      routeAction: undefined,
      analyticsAction: undefined,
      errorAction: undefined
    });
  });

  it('should remove event listener and not trigger callback', () => {
    const ref = React.createRef<HTMLDivElement>();

    const callback = jest.fn();
    const props: GlobalEventsProps = {ref};
    const wrapper = ({children}: any) => <div ref={ref}>{children}</div>;
    const {unmount} = renderHook(
      () => {
        useGlobalEvents(props, callback);
      },
      {wrapper}
    );
    unmount();

    // call dispatch event
    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});
    act(() => {
      ref.current?.dispatchEvent(event);
    });

    expect(callback).not.toHaveBeenCalledWith(event, undefined, undefined, undefined);
  });
});

describe('addEventListener', () => {
  it('should add event listener', () => {
    const elem = document.createElement('div');
    const callback = jest.fn();

    addEventListener(elem, callback);

    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});
    elem.dispatchEvent(event);

    expect(callback).toHaveBeenCalledWith(event);
  });

  it('should not add event listener', () => {
    const elem = null;
    const callback = jest.fn();

    addEventListener(elem, callback);

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('removeEventListener', () => {
  it('should remove event listener', () => {
    const elem = document.createElement('div');
    const callback = jest.fn();

    addEventListener(elem, callback);
    removeEventListener(elem, callback);

    const payload: RouteEventPayload = {href: 'test'};
    const event = getEvent({type: ROUTE_EVENT.TYPE, payload});
    elem.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalledWith(event);
  });
});
