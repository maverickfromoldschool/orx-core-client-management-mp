import React from 'react';

export interface UseOrxCorePricingProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseOrxCorePricingReturn {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
