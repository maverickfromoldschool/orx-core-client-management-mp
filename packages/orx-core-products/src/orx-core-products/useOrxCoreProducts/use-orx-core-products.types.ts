import React from 'react';

export interface UseOrxCoreProductsProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseOrxCoreProductsReturn {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
