import {
  OrxCoreProductsProps,
  RouteEventPayload,
  AnalyticsEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-products';

export interface ApplicationWrapperProps extends Pick<OrxCoreProductsProps, 'text'> {
  container: HTMLDivElement;
  routeAction?: (e: RouteEventPayload) => void;
  analyticsAction?: (e: AnalyticsEventPayload) => void;
  theme?: string;
  errorAction?: (e: ErrorEventPayload) => void;
}
