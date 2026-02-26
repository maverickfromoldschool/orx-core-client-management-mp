export interface UseAnalyticsEventProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseAnalyticsEventReturn {
  dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void;
}

export interface AnalyticsEvent {
  type: ANALYTICS_EVENT.TYPE;
  payload: AnalyticsEventPayload;
}

export enum ANALYTICS_EVENT {
  TYPE = '[ORX_CORE_PRICING] ANALYTICS'
}

export interface AnalyticsEventPayload {
  category: string;
}
