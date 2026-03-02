import React from 'react';

import {useRouteEvent} from '../events/useRouteEvent/use-route-event';
import {useAnalyticsEvent} from '../events/useAnalyticsEvent/use-analytics-event';

import {UseClickLinkProps, UseClickLinkReturn} from './use-click-link.types';

export function useClickLink(props: UseClickLinkProps): UseClickLinkReturn {
  const {ref} = props;

  const {dispatchRouteEvent} = useRouteEvent({ref});
  const {dispatchAnalyticsEvent} = useAnalyticsEvent({ref});

  function onClickLink(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    e.stopPropagation();

    const {
      currentTarget: {
        href,
        dataset: {category}
      }
    } = e;

    dispatchRouteEvent({href});
    dispatchAnalyticsEvent({category: category || ''});
  }

  return {
    onClickLink
  };
}

export default useClickLink;
