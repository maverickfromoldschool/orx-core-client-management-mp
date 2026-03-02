import {
  OrxCoreClientManagementProps,
  RouteEventPayload,
  AnalyticsEventPayload,
  ErrorEventPayload
} from '@optum-rx-core/orx-core-client-management';

export interface ApplicationWrapperProps extends Pick<OrxCoreClientManagementProps, 'text'> {
  container: HTMLDivElement;
  routeAction?: (e: RouteEventPayload) => void;
  analyticsAction?: (e: AnalyticsEventPayload) => void;
  theme?: string;
  errorAction?: (e: ErrorEventPayload) => void;
}
