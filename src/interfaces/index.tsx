/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertColor } from '@mui/material';

export interface Service {
  id: string;
  created_at: number;
  updated_at: number;
  name: string;
  retries: number;
  protocol: string;
  host: string;
  port: number;
  path: string;
  connect_timeout: number;
  write_timeout: number;
  read_timeout: number;
}

export interface RouteDetails {
  snis: any;
  strip_path: any | boolean;
  tags: any;
  path_handling: any;
  service: any;
  service_name: any;
  paths: any;
  methods: any;
  sources: any;
  destinations: any;
  request_buffering?: any;
  response_buffering?: any;
  protocols: any;
  https_redirect_status_code: any;
  preserve_host: any;
  regex_priority: any;
  headers: any;
  id?: any;
  hosts: any;
  name: any;
  created_at?: Date | string | number;
  updated_at?: Date | string | number;
}

export type Menus = {
  name: string;
  icon: any;
};
export type PluginBoxContainerProps = {
  icon: React.ReactNode;
  header: string;
  chips: { name: string; flag: boolean }[];
  coloredChipNames: string[];
};

export type snackAlertProps = {
  open: boolean;
  message: string;
  severity: AlertColor;
  handleClose: VoidFunction;
};

type KeyValue = {
  key: string;
  value: string;
};

export type InfoBoxProps = {
  icon: React.ReactNode;
  name: string;
  keyValues: KeyValue[];
};

export type DialogModalProps = {
  description: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export type keyValueType = {
  key: string;
  value: string;
  type: string;
};

export type ServiceDetails = {
  id: any;
  name: any;
  description: any;
  tags: any;
  retries: any;
  protocol: any;
  host: any;
  port: any;
  path: any;
  connect_timeout: any;
  write_timeout: any;
  read_timeout: any;
  client_certificate: any;
  ca_certificates?: any;
  created_at?: Date | string | number;
  updated_at?: Date | string | number;
};

export type EditorProps = {
  content: RouteDetails;
  textFields: keyValueType[];
  param: boolean;
};

export type ServiceEditorProps = {
  service: ServiceDetails;
  textFields: keyValueType[];
};

export type snackMessageProp = {
  message: string;
  severity: AlertColor;
};

export type navBarProps = {
  value: string;
  icon: JSX.Element;
};

export type navPanelProps = {
  list: navBarProps[];
  cur: navBarProps;
  isNew: boolean;
};

export type MenuItemProps = {
  open: boolean;
  handlePageRender(page: string): void;
  page: string;
  icon: JSX.Element;
  curLocation: string;
};

export type PageHeaderIconProps = {
  header: string;
  icon: JSX.Element;
};
export type PageHeaderDescProps = {
  header: string;
  description: string;
};

export type RawViewProps = {
  json: object;
  open: boolean;
  onClose: VoidFunction;
};

export type DetailViewerProps = {
  navList: navBarProps[];
  textFields: keyValueType[];
  pageHeader: string;
  pageDesc: string;
};

export type toggleProps = {
  yes: boolean;
  onChange: VoidFunction;
};

export type TagProps = {
  tag: string;
  isList: boolean;
};

export type PageTypeProps = {
  type: string;
};

export type CreateRouteProps = {
  open: boolean;
  onClose: VoidFunction;
};
