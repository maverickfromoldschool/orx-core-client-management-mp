export interface UseClickLinkProps {
  ref: React.RefObject<HTMLDivElement>;
}

export interface UseClickLinkReturn {
  onClickLink: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
