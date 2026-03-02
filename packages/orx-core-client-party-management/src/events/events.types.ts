import {AnalyticsEvent} from './useAnalyticsEvent/use-analytics-event.types';
import {RouteEvent} from './useRouteEvent/use-route-event.types';
import {ErrorEvent} from './useErrorEvent/use-error-event.types';

export type OrxCoreClientManagementEvent = RouteEvent | AnalyticsEvent | ErrorEvent;
