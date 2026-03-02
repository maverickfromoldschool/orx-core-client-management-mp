import React from 'react';

export interface UseOrxCoreClientManagementProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseOrxCoreClientManagementReturn {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
