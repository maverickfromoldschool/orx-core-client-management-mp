import {OrxCoreFileCenterEvent} from './events.types';

export function getEvent(detail: OrxCoreFileCenterEvent) {
  return new CustomEvent<OrxCoreFileCenterEvent>('event', {detail, composed: true, bubbles: true});
}
