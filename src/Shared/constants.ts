import { keyValueType } from '../interfaces';

export const BASE_API_URL: string =
  process.env.API_URL || 'http://localhost:8001';
export const ROUTE_TEXT_FIELDS: keyValueType[] = [
  { key: 'name', value: 'The name of the Route.', type: 'text' },

  { key: 'tags', value: 'Optionally add tags to the route', type: 'list' },

  {
    key: 'hosts',
    value:
      'A list of domain names that match this Route. For example: example.com. At least one of hosts, paths, or methods must be set.',
    type: 'list',
  },

  {
    key: 'paths',
    value:
      'A list of paths that match this Route. For example: /my-path. At least one of hosts, paths, or methods must be set.',
    type: 'list',
  },

  {
    key: 'headers',
    value:
      'One or more lists of values indexed by header name that will cause this Route to match if present in the request. The Host header cannot be used with this attribute: hosts should be specified using the hosts attribute.Field values format example: x-some-header:foo,bar',
    type: 'list',
  },

  {
    key: 'path_handling',
    value:
      'Controls how the Service path, Route path and requested path are combined when sending a request to the upstream. See above for a detailed description of each behavior. Accepted values are: "v0", "v1". Defaults to "v1".',
    type: 'dropdown',
  },

  {
    key: 'https_redirect_status_code',
    value:
      'The status code Kong responds with when all properties of a Route match except the protocol, i.e. if the protocol of the request is HTTP instead of HTTPS. Location header is injected by Kong if the field is set to 301, 302, 307 or 308. Defaults to 426.',
    type: 'number',
  },

  {
    key: 'regex_priority',
    value:
      'A number used to choose which route resolves a given request when several routes match it using regexes simultaneously. When two routes match the path and have the same regex_priority, the older one (lowest created_at) is used. Note that the priority for non-regex routes is different (longer non-regex routes are matched before shorter ones). Defaults to 0.',
    type: 'number',
  },
  {
    key: 'methods',
    value:
      'A list of HTTP methods that match this Route. At least one of hosts, paths, or methods must be set.',
    type: 'list',
  },
  {
    key: 'strip_path',
    value:
      'When matching a Route via one of the paths, strip the matching prefix from the upstream request URL.',
    type: 'checkbox',
  },
  {
    key: 'preserve_host',
    value:
      'When matching a Route via one of the paths, strip the matching prefix from the upstream request URL.',
    type: 'checkbox',
  },
  {
    key: 'protocols',
    value:
      'A list of the protocols this Route should allow. By default it is ["http", "https"], which means that the Route accepts both. When set to ["https"], HTTP requests are answered with a request to upgrade to HTTPS.',
    type: 'list',
  },
  {
    key: 'snis',
    value:
      'A list of SNIs that match this Route when using stream routing. When using tcp or tls protocols, at least one of snis, sources, or destinations must be set.',
    type: 'list',
  },
  {
    key: 'sources',
    value:
      'A list of IP sources of incoming connections that match this Route when using stream routing. Each entry is an object with fields “ip” (optionally in CIDR range notation) and/or “port”. When using tcp or tls protocols, at least one of snis, sources, or destinations must be set.The field expects values with ip:port format. ex: 192.168.1.2:3000.',
    type: 'list',
  },
  {
    key: 'destinations',
    value:
      'A list of IP destinations of incoming connections that match this Route when using stream routing. Each entry is an object with fields “ip” (optionally in CIDR range notation) and/or “port”. When using tcp or tls protocols, at least one of snis, sources, or destinations must be set.The field expects values with ip:port format. ex: 192.168.1.2:3000',
    type: 'list',
  },
];

export const SERVICE_TEXT_FIELDS: keyValueType[] = [
  { key: 'name', value: 'The service name.', type: 'text' },
  {
    key: 'description',
    value: 'An optional service description.',
    type: 'text',
  },
  { key: 'tags', value: 'Optionally add tags to the service', type: 'list' },
  {
    key: 'protocol',
    value:
      'The protocol used to communicate with the upstream. It can be one of http or https.',
    type: 'text',
  },

  { key: 'host', value: 'The host of the upstream server.', type: 'text' },
  {
    key: 'port',
    value: 'The upstream server port. Defaults to 80.',
    type: 'number',
  },

  {
    key: 'path',
    value:
      'The path to be used in requests to the upstream server. Empty by default.',
    type: 'text',
  },

  {
    key: 'retries',
    value:
      'The number of retries to execute upon failure to proxy. The default is 5.',
    type: 'number',
  },

  {
    key: 'connect_timeout',
    value:
      'The timeout in milliseconds for establishing a connection to your upstream server. Defaults to 60000',
    type: 'number',
  },

  {
    key: 'write_timeout',
    value:
      'The timeout in milliseconds between two successive write operations for transmitting a request to the upstream server. Defaults to 60000',
    type: 'number',
  },

  {
    key: 'read_timeout',
    value:
      'The timeout in milliseconds between two successive read operations for transmitting a request to the upstream server. Defaults to 60000',
    type: 'number',
  },
  {
    key: 'client_certificate',
    value:
      'Certificate (id) to be used as client certificate while TLS handshaking to the upstream server.',
    type: 'text',
  },
];

export const SERVICE_DETAILS_INTERFACE = {
  id: '',
  name: '',
  description: '',
  retries: 5,
  protocol: '',
  host: '',
  port: 80,
  path: '',
  connect_timeout: 60000,
  write_timeout: 60000,
  read_timeout: 60000,
  tags: [],
  client_certificate: '',
  ca_certificates: '',
};

export const ROUTE_DETAILS_INTERFACE = {
  name: '',
  tags: [],
  hosts: [],
  paths: [],
  headers: [],
  path_handling: 'v1',
  https_redirect_status_code: 426,
  regex_priority: 0,
  methods: [],
  strip_path: true,
  preserve_host: false,
  protocols: [],
  snis: [],
  sources: [],
  destinations: [],
  service_name: '',
  service: {},
};

export const API_RESPONSE_SNACK_MESSAGE = {
  unableToFetchData: 'Unable to Fetch data, Please try again!',
  couldNotModifyData: 'Could not able to modify data!',
  unableToSaveData: 'Unable to save data, Please try again!',
  createdNewService: 'Successfully created the service!',
  modifiedExistingService: 'Successfully modified the service!',
  createdNewRoute: 'Successfully created the Route!',
  modifiedExistingRoute: 'Successfully modified the Route!',
  deletedService: 'Successfully deleted the Service',
  unableToDelete: 'Unable to delete data, Please try again!',
  fetchedData: 'Successfully fetched data!',
};

export const ACTION_TYPES = {
  OPEN_ROUTE_MODAL: 'OPEN_ROUTE_MODAL',
  REFRESH_ROUTE_TABLE: 'REFRESH_ROUTE_TABLE',
  OPEN_SNACK_BAR: 'OPEN_SNACK_BAR',
  SET_SNACK_BAR_MESSAGE: 'SET_SNACK_BAR_MESSAGE',
  UPDATE_ROUTE_DATA: 'UPDATE_ROUTE_DATA',
  UPDATE_ROUTE_DATA_VALUES: 'UPDATE_ROUTE_DATA_VALUES',
  UPDATE_SERVICE_DATA: 'UPDATE_SERVICE_DATA',
  UPDATE_SERVICE_DATA_VALUES: 'UPDATE_SERVICE_DATA_VALUES',
};

export const PROCESS_TYPE = {
  PRE_PROCESS: 'PRE_PROCESS',
  POST_PROCESS: 'POST_PROCESS',
};
