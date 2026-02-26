export interface UseRouteEventProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseRouteEventReturn {
  dispatchRouteEvent: (payload: RouteEventPayload) => void;
}

export interface RouteEvent {
  type: ROUTE_EVENT.TYPE;
  payload: RouteEventPayload;
}

export enum ROUTE_EVENT {
  TYPE = '[ORX_CORE_PRODUCTS] ROUTE'
}

export interface RouteEventPayload {
  href: string;
}
