import React, {createContext, useMemo} from 'react';

export const BreadcrumbsContext = createContext<
  | {
      setBreadcrumbs: (data: {name: string; link: string}[]) => void;
    }
  | undefined
>(undefined);

interface BreadcrumbsContextProviderProps {
  children: React.ReactNode;
  setBreadcrumbs?: ((data: {name: string; link: string}[]) => void) | null;
}

export const BreadcrumbsContextProvider: React.FC<BreadcrumbsContextProviderProps> = ({
  children,
  setBreadcrumbs = null
}) => {
  const value = useMemo(
    () => ({
      setBreadcrumbs:
        setBreadcrumbs ||
        ((data: {name: string; link: string}[]) => {
          // eslint-disable-next-line no-console
          console.log('Breadcrumbs Fallback set to:', data);
        })
    }),
    [setBreadcrumbs]
  );

  return <BreadcrumbsContext.Provider value={value}>{children}</BreadcrumbsContext.Provider>;
};

export const useBreadcrumbs = () => {
  const context = React.useContext(BreadcrumbsContext);
  if (!context) {
    return {
      setBreadcrumbs: (data: {name: string; link: string}[]) => {
        // eslint-disable-next-line no-console
        console.log('Breadcrumbs Fallback set to:', data);
      }
    };
  }
  return context;
};
