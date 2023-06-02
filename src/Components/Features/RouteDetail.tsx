import { Box, CssBaseline, Divider } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import ExtensionIcon from '@mui/icons-material/Extension';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from './PageHeader';
import NavPanel from './MiniNavPanel';
import MiniPageHeader from './MiniPageHeader';
import { BASE_API_URL } from '../../Shared/constants';
import { GET } from '../../Helpers/ApiHelpers';
import { RouteDetails, keyValueType, navBarProps } from '../../interfaces';
import RouteEditor from './RouteEditor';

const RouteDetail = (): JSX.Element => {
  const { id } = useParams();
  const [content, setContent] = React.useState<RouteDetails>({
    name: '',
    tags: '',
    hosts: '',
    paths: '',
    headers: '',
    path_handling: '',
    https_redirect_status_code: 426,
    regex_priority: 0,
    methods: '',
    strip_path: true,
    preserve_host: false,
    protocols: '',
    snis: '',
    sources: '',
    destinations: '',
  });
  const [loading, setLoading] = React.useState(true);
  const preProcess = (data: RouteDetails): RouteDetails => {
    const keyList = Object.keys(data);
    for (let i = 0; i < keyList.length; i += 1) {
      const key = keyList[i];
      if (
        data[key as keyof typeof data] === null ||
        data[key as keyof typeof data] === undefined ||
        key === 'headers'
      )
        // eslint-disable-next-line no-param-reassign
        data[key as keyof typeof data] = [];
    }
    return data;
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getData = async () => {
      const { data } = await GET({
        url: `${BASE_API_URL}/routes/${id}/`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      console.log(data);
      setContent(preProcess(data));
      setLoading(false);
    };
    getData();
  }, [id, loading]);

  const list: navBarProps[] = [
    { value: 'Route Details', icon: <IconInfoCircle /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
  ];
  const textFields: keyValueType[] = [
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
      type: 'text',
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
  return (
    <Box sx={{ width: '1250px', margin: 'auto' }}>
      <CssBaseline />
      <PageHeader
        header={`Routes ${content.name}`}
        description="<a href='/routes' style=color:'#79C2E3';text-decoration:none>routes</a> / show"
      />
      <br />
      <Divider />
      <Box
        sx={{
          width: '1250px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <NavPanel list={list} cur={list[0]} isNew={false} />
        <Box
          sx={{
            width: '1000px',
            alignContent: 'center',
          }}
        >
          <MiniPageHeader
            header="<b>Route Details</b>"
            icon={<IconInfoCircle />}
          />
          {loading ? (
            <Box
              sx={{ display: 'flex', height: '500px', alignItems: 'center' }}
            >
              <CircularProgress sx={{ margin: 'auto', color: '#1ABB9C' }} />
            </Box>
          ) : (
            <RouteEditor
              content={content}
              textFields={textFields}
              navPath="routes"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RouteDetail;
