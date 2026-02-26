'use client';

import React from 'react';
import {NotificationProvider, useNotification} from '@optum-rx-core/orx-core-notification';
import {BreadcrumbsContextProvider} from '@optum-rx-core/orx-core-client-shared';

import {OrxCoreFileCenterProvider} from '../../orx-core-file-center-provider/OrxCoreFileCenterProvider/orx-core-file-center-provider';
import {useOrxCoreFileCenter} from '../useOrxCoreFileCenter/use-orx-core-file-center';
import {FileCenterHome} from '../../file-center-home/FileCenterHome/file-center-home';
import {setNotifier} from '../../notification/bridge';

import {OrxCoreFileCenterProps} from './orx-core-file-center.types';

const RegisterNotifier: React.FC = () => {
  // register provider functions on mount so non-React code can notify
  const {showError, showWarning, showInfo, showSuccess, showNotification} = useNotification();
  React.useEffect(() => {
    setNotifier((message, opts) => {
      const sev = opts?.severity ?? 'error';
      switch (sev) {
        case 'error':
          return showError(message);
        case 'warning':
          return showWarning(message);
        case 'info':
          return showInfo(message);
        case 'success':
          return showSuccess(message);
        default:
          return showNotification(message);
      }
    });
  }, [showError, showWarning, showInfo, showSuccess, showNotification]);
  return null;
};

export const OrxCoreFileCenter = React.forwardRef<HTMLDivElement, OrxCoreFileCenterProps>((props, ref) => {
  const {setRef} = props;
  // use an internal ref object for hooks that expect a RefObject
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const hookProps = useOrxCoreFileCenter({ref: localRef});

  return (
    <div
      ref={(el) => {
        // keep localRef up-to-date for hooks
        localRef.current = el;
        // call optional setRef prop (only when element is available)
        if (typeof setRef === 'function' && el) {
          try {
            setRef(el);
          } catch {
            // ignore
          }
        }

        // forward the ref passed to this component (supports function and object refs)
        if (ref) {
          if (typeof ref === 'function') {
            if (el) {
              try {
                ref(el);
              } catch {
                // ignore
              }
            }
          } else {
            // assign to a local variable to avoid reassigning function parameter properties
            const objRef = ref;
            try {
              objRef.current = el;
            } catch {
              // ignore
            }
          }
        }
      }}
    >
      <NotificationProvider>
        <OrxCoreFileCenterProvider {...props} {...hookProps}>
          <BreadcrumbsContextProvider setBreadcrumbs={props.setBreadcrumbs}>
            <RegisterNotifier />
            <div>
              <FileCenterHome />
            </div>
          </BreadcrumbsContextProvider>
        </OrxCoreFileCenterProvider>
      </NotificationProvider>
    </div>
  );
});

export default OrxCoreFileCenter;
