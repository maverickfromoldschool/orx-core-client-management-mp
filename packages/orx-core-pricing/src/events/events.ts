import {OrxCorePricingEvent} from './events.types';

export function getEvent(detail: OrxCorePricingEvent) {
  return new CustomEvent<OrxCorePricingEvent>('event', {detail, composed: true, bubbles: true});
}
