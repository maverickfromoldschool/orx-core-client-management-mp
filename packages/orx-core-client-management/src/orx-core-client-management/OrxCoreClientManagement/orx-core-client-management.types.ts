export interface OrxCoreClientManagementProps {
  /**
   * The main text content of the OrxCoreClientManagement component.
   */
  text: string;

  /**
   * A callback function that sets the ref for the OrxCoreClientManagement component.
   */
  setRef?: ((element: HTMLDivElement) => void) | undefined;

  setBreadcrumbs?: ((data: {name: string; link: string}[]) => void) | null;
}
