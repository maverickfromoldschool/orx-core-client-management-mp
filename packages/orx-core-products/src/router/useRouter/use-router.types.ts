import {NavigateFunction, Params} from 'react-router-dom';

export interface useRouterReturn {
  params: Params;
  navigate: NavigateFunction;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}
