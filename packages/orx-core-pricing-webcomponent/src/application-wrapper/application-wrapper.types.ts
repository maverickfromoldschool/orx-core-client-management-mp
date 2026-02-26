import {
  OrxCorePricingProps,
  RouteEventPayload,
  AnalyticsEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-pricing';

export interface ApplicationWrapperProps extends Pick<OrxCorePricingProps, 'text'> {
  container: HTMLDivElement;
  routeAction?: (e: RouteEventPayload) => void;
  analyticsAction?: (e: AnalyticsEventPayload) => void;
  theme?: string;
  errorAction?: (e: ErrorEventPayload) => void;
}
