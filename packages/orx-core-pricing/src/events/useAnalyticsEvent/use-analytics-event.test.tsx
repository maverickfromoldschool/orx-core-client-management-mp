import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {getEvent} from '../events';

import {useAnalyticsEvent} from './use-analytics-event';
import {ANALYTICS_EVENT, AnalyticsEventPayload, UseAnalyticsEventProps} from './use-analytics-event.types';

describe('useAnalyticsEvent', () => {
  it('should dispatch event', () => {
    const ref = React.createRef<HTMLDivElement>();

    const callback = jest.fn();
    const props: UseAnalyticsEventProps = {ref};
    const wrapper = ({children}: any) => <div ref={ref}>{children}</div>;
    const {result} = renderHook(() => useAnalyticsEvent(props), {wrapper});

    expect(result.current).toBeTruthy();
    ref.current?.addEventListener('event', callback);

    // call dispatch event
    const payload: AnalyticsEventPayload = {category: 'test'};
    act(() => {
      result.current.dispatchAnalyticsEvent(payload);
    });

    expect(callback).toHaveBeenCalledWith(getEvent({type: ANALYTICS_EVENT.TYPE, payload}));
  });
});
