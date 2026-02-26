import React from 'react';
import {OrxCoreAdminSettings} from '@optum-rx-core/orx-core-admin-settings';
import ThemeProvider from '@mui/system/ThemeProvider';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import {ThemeOptions} from '@mui/material/styles';
import {CacheProvider as EmotionStyleCacheProvider} from '@emotion/react';
import createEmotionStyleCache from '@emotion/cache';
import {useCheckTheme} from '@optum-rx-skyline/themes';

import {useGlobalEvents} from '../use-global-events/use-global-events';

import {ApplicationWrapperProps} from './application-wrapper.types';

export const ApplicationWrapper = (props: ApplicationWrapperProps) => {
  const {container, theme = '', routeAction, analyticsAction, errorAction} = props;
  const ref = React.useRef<HTMLDivElement>(container);
  useGlobalEvents({ref, routeAction, analyticsAction, errorAction});
  const {theme: loadedTheme, error} = useCheckTheme({themeName: theme});

  const styleCache = createEmotionStyleCache({
    key: 'orx-core-admin-settings',
    container
  });

  React.useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.log('Error loading theme', error);
    }
  }, [theme, error]);

  return (
    <EmotionStyleCacheProvider value={styleCache}>
      <ScopedCssBaseline>
        <ThemeProvider theme={loadedTheme as ThemeOptions}>
          <OrxCoreAdminSettings {...props} />
        </ThemeProvider>
      </ScopedCssBaseline>
    </EmotionStyleCacheProvider>
  );
};

export default ApplicationWrapper;
