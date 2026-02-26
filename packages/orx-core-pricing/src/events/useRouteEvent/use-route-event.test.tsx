import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {getEvent} from '../events';

import {useRouteEvent} from './use-route-event';
import {ROUTE_EVENT, RouteEventPayload, UseRouteEventProps} from './use-route-event.types';

describe('useRouteEvent', () => {
  it('should dispatch event', () => {
    const ref = React.createRef<HTMLDivElement>();

    const callback = jest.fn();
    const props: UseRouteEventProps = {ref};
    const wrapper = ({children}: any) => <div ref={ref}>{children}</div>;
    const {result} = renderHook(() => useRouteEvent(props), {wrapper});

    expect(result.current).toBeTruthy();
    ref.current?.addEventListener('event', callback);

    // call dispatch event
    const payload: RouteEventPayload = {href: 'test'};
    act(() => {
      result.current.dispatchRouteEvent(payload);
    });

    expect(callback).toHaveBeenCalledWith(getEvent({type: ROUTE_EVENT.TYPE, payload}));
  });
});
