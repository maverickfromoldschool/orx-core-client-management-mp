export interface OrxCoreFileCenterProps {
  /**
   * The main text content of the OrxCoreFileCenter component.
   */
  text: string;

  /**
   * A callback function that sets the ref for the OrxCoreFileCenter component.
   */
  setRef?: ((element: HTMLDivElement) => void) | undefined;

  setBreadcrumbs?: ((data: {name: string; link: string}[]) => void) | null;
}
