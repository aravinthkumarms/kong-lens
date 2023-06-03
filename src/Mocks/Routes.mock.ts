export const routeData = [
  {
    snis: null,
    strip_path: true,
    tags: null,
    path_handling: 'v1',
    service: {
      id: '91145a49-bebc-49a4-bf54-cbc6422b7db6',
    },
    paths: ['/v1', '/v2'],
    methods: ['GET', 'POST'],
    sources: null,
    destinations: null,
    request_buffering: true,
    response_buffering: true,
    protocols: ['http', 'https'],
    https_redirect_status_code: 426,
    preserve_host: false,
    regex_priority: 0,
    headers: {
      'some-header': ['foo', 'bar'],
    },
    id: '47a98444-86fe-4daf-b0af-666ee7d87dbf',
    hosts: ['route.api.com'],
    name: 'example_route_1',
    created_at: 1685598938,
    updated_at: 1685598972,
  },
  {
    snis: null,
    strip_path: true,
    tags: null,
    path_handling: 'v0',
    service: {
      id: '91145a49-bebc-49a4-bf54-cbc6422b7db6',
    },
    paths: ['/v1', '/v2'],
    methods: null,
    sources: null,
    destinations: null,
    request_buffering: true,
    response_buffering: true,
    protocols: ['http', 'https'],
    https_redirect_status_code: 426,
    preserve_host: false,
    regex_priority: 0,
    headers: null,
    id: '56c4566c-14cc-4132-9011-4139fcbbe50a',
    hosts: ['foo.example.com', 'foo.example.us'],
    name: 'example-route',
    created_at: 1685598828,
    updated_at: 1685598828,
  },
];