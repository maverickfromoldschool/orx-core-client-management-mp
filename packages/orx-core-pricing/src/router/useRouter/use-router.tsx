'use client';

import {useParams, useNavigate, useSearchParams} from 'react-router-dom';

import {useRouterReturn} from './use-router.types';

/**
 * Custom hook for managing router functionality.
 * @returns An object containing the router parameters, navigation function, search parameters, and search parameters setter.
 */
export function useRouter(): useRouterReturn {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    params,
    navigate,
    searchParams,
    setSearchParams
  };
}

export default useRouter;
