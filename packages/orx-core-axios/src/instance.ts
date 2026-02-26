import {createApiClient} from './axios';

const getBaseurl = () => {
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    if (currentUrl.startsWith('https://coreweb-test-ui.optum.com')) {
      return 'https://coreweb-test-api.optum.com';
    }
  }
  return 'https://coreweb-dev-api.optum.com';
};

export const optumAxios = createApiClient({
  baseURL: getBaseurl(),
  withCredentials: false
});

export default optumAxios;
