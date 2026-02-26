import {OrxCoreProductsEvent} from './events.types';

export function getEvent(detail: OrxCoreProductsEvent) {
  return new CustomEvent<OrxCoreProductsEvent>('event', {detail, composed: true, bubbles: true});
}
