import {FileCenterHomeProps} from '../FileCenterHome/file-center-home.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseFileCenterHomeProps extends FileCenterHomeProps {}

/**
 * Represents the return type of the `UseFileCenterHome` hook.
 */
export interface UseFileCenterHomeReturn {
  value: string;
  onClick: () => void;
}
