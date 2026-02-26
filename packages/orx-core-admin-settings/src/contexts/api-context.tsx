import React, {createContext, useContext, useMemo} from 'react';

import {ApiConfig} from '../types/api-accounting-code-config.types';
import {AccountingCodeApiService} from '../services/accounting-code-api.service';

interface ApiContextValue {
  apiService: AccountingCodeApiService;
}

const ApiContext = createContext<ApiContextValue | null>(null);

interface ApiProviderProps {
  config: ApiConfig;
  children: React.ReactNode;
}

/**
 * Provider component that makes API service available to all child components
 */
export function ApiProvider({config, children}: ApiProviderProps) {
  const apiService = useMemo(() => new AccountingCodeApiService(config), [config]);
  const value = useMemo(() => ({apiService}), [apiService]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

/**
 * Hook to access the API service
 */
export function useApiService() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApiService must be used within an ApiProvider');
  }

  return context.apiService;
}
