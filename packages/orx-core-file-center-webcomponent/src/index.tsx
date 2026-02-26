import r2wc from '@r2wc/react-to-web-component';
import {R2WCOptions} from '@r2wc/core';

import {ApplicationWrapper} from './application-wrapper/application-wrapper';
import {ApplicationWrapperProps} from './application-wrapper/application-wrapper.types';

export const options: R2WCOptions<ApplicationWrapperProps> = {
  props: {
    text: 'string',
    routeAction: 'function',
    analyticsAction: 'function',
    theme: 'string',
    errorAction: 'function'
  }
};

export function init() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const OrxCoreFileCenter = r2wc<ApplicationWrapperProps>(ApplicationWrapper, {...options});

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  customElements.define('orx-core-file-center', OrxCoreFileCenter);
}

init();
