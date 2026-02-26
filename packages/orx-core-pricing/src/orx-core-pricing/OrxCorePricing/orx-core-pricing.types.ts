export interface OrxCorePricingProps {
  text: string;
  setRef?: ((element: HTMLDivElement) => void) | undefined;
  setBreadcrumbs?: (data: {name: string; link: string}[]) => void;
}
