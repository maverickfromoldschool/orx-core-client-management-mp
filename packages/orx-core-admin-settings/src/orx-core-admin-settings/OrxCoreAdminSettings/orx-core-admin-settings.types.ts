export interface OrxCoreAdminSettingsProps {
  text?: string;
  setRef?: (ref: HTMLDivElement) => void;
  setBreadcrumbs?: (data: {name: string; link: string}[]) => void;
}
