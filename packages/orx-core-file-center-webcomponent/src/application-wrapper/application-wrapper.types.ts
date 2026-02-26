import {
  OrxCoreFileCenterProps,
  RouteEventPayload,
  AnalyticsEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-file-center';

export interface ApplicationWrapperProps extends Pick<OrxCoreFileCenterProps, 'text'> {
  container: HTMLDivElement;
  routeAction?: (e: RouteEventPayload) => void;
  analyticsAction?: (e: AnalyticsEventPayload) => void;
  theme?: string;
  errorAction?: (e: ErrorEventPayload) => void;
}
