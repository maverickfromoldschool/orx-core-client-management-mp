import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {getEvent} from '../events';

import {useErrorEvent} from './use-error-event';
import {ERROR_EVENT, ErrorEventPayload, UseErrorEventProps} from './use-error-event.types';

describe('useErrorEvent', () => {
  it('should dispatch event', () => {
    const ref = React.createRef<HTMLDivElement>();

    const callback = jest.fn();
    const props: UseErrorEventProps = {ref};
    const wrapper = ({children}: any) => <div ref={ref}>{children}</div>;
    const {result} = renderHook(() => useErrorEvent(props), {wrapper});

    expect(result.current).toBeTruthy();
    ref.current?.addEventListener('event', callback);

    // call dispatch event
    const payload: ErrorEventPayload = {error: new Error('test error')};
    act(() => {
      result.current.dispatchErrorEvent(payload);
    });

    expect(callback).toHaveBeenCalledWith(getEvent({type: ERROR_EVENT.TYPE, payload}));
  });
});
