export interface OrxCoreProductsProps {
  /**
   * The main text content of the OrxCoreProducts component.
   */
  text: string;

  /**
   * A callback function that sets the ref for the OrxCoreProducts component.
   */
  setRef?: ((element: HTMLDivElement) => void) | undefined;
}
