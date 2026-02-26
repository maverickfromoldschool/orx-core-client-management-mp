import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import * as routeHook from '../events/useRouteEvent/use-route-event';
import * as analyticsHook from '../events/useAnalyticsEvent/use-analytics-event';

import {useClickLink} from './use-click-link';
import {UseClickLinkProps} from './use-click-link.types';

jest.mock('../events/useRouteEvent/use-route-event');
jest.mock('../events/useAnalyticsEvent/use-analytics-event');

describe('useClickLink', () => {
  it('should return expected value', () => {
    const mockedRouteHook = routeHook as jest.Mocked<typeof routeHook>;
    const mockedAnalyticsHook = analyticsHook as jest.Mocked<typeof analyticsHook>;

    const mockDispatchRouteEvent = jest.fn();
    (mockedRouteHook.useRouteEvent as any).mockReturnValue({dispatchRouteEvent: mockDispatchRouteEvent});

    const mockDispatchAnalyticsEvent = jest.fn();
    (mockedAnalyticsHook.useAnalyticsEvent as any).mockReturnValue({
      dispatchAnalyticsEvent: mockDispatchAnalyticsEvent
    });

    const ref = React.createRef<HTMLDivElement>();
    const props: UseClickLinkProps = {ref};
    const {result} = renderHook(() => useClickLink(props));

    const href = '/test';
    const category = 'test';
    const mockPreventDefault = jest.fn();
    const mockStopPropagation = jest.fn();
    const event = {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation,
      currentTarget: {
        href,
        dataset: {category}
      }
    } as unknown;

    expect(result.current).toBeTruthy();
    expect(result.current.onClickLink).toBeTruthy();

    act(() => {
      result.current.onClickLink(event as React.MouseEvent<HTMLAnchorElement>);
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockStopPropagation).toHaveBeenCalled();
    expect(mockDispatchRouteEvent).toHaveBeenCalledWith({href});
    expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({category});
  });

  it('should return expected value with empty category', () => {
    const mockedRouteHook = routeHook as jest.Mocked<typeof routeHook>;
    const mockedAnalyticsHook = analyticsHook as jest.Mocked<typeof analyticsHook>;

    const mockDispatchRouteEvent = jest.fn();
    (mockedRouteHook.useRouteEvent as any).mockReturnValue({dispatchRouteEvent: mockDispatchRouteEvent});

    const mockDispatchAnalyticsEvent = jest.fn();
    (mockedAnalyticsHook.useAnalyticsEvent as any).mockReturnValue({
      dispatchAnalyticsEvent: mockDispatchAnalyticsEvent
    });

    const ref = React.createRef<HTMLDivElement>();
    const props: UseClickLinkProps = {ref};
    const {result} = renderHook(() => useClickLink(props));

    const href = '/test';
    const mockPreventDefault = jest.fn();
    const mockStopPropagation = jest.fn();
    const event = {
      preventDefault: mockPreventDefault,
      stopPropagation: mockStopPropagation,
      currentTarget: {
        href,
        dataset: {}
      }
    } as unknown;

    expect(result.current).toBeTruthy();
    expect(result.current.onClickLink).toBeTruthy();

    act(() => {
      result.current.onClickLink(event as React.MouseEvent<HTMLAnchorElement>);
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockStopPropagation).toHaveBeenCalled();
    expect(mockDispatchRouteEvent).toHaveBeenCalledWith({href});
    expect(mockDispatchAnalyticsEvent).toHaveBeenCalledWith({category: ''});
  });
});
