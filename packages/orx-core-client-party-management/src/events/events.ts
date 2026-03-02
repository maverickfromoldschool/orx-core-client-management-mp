import {OrxCoreClientManagementEvent} from './events.types';

export function getEvent(detail: OrxCoreClientManagementEvent) {
  return new CustomEvent<OrxCoreClientManagementEvent>('event', {detail, composed: true, bubbles: true});
}
