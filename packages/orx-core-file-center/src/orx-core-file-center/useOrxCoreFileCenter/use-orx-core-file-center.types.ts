import React from 'react';

export interface UseOrxCoreFileCenterProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseOrxCoreFileCenterReturn {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
