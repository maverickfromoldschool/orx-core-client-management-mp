export interface UseErrorEventProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseErrorEventReturn {
  dispatchErrorEvent: (payload: ErrorEventPayload) => void;
}

export interface ErrorEvent {
  type: ERROR_EVENT.TYPE;
  payload: ErrorEventPayload;
}

export enum ERROR_EVENT {
  TYPE = '[ORX_CORE_PRICING] ERROR'
}

export interface ErrorEventPayload {
  error: Error;
}
