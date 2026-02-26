import {OrxCoreAdminSettingsProps} from '@optum-rx-core/orx-core-admin-settings';

export interface ApplicationWrapperProps extends Pick<OrxCoreAdminSettingsProps, 'text'> {
  container: HTMLDivElement;
  routeAction?: (e: any) => void;
  analyticsAction?: (e: any) => void;
  theme?: string;
  errorAction?: (e: any) => void;
}
