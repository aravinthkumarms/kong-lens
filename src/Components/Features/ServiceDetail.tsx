import { Box, CssBaseline, Divider } from '@mui/material';
import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ExtensionIcon from '@mui/icons-material/Extension';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from './PageHeader';
import NavPanel from './MiniNavPanel';
import ServiceEditor from './ServiceEditor';
import MiniPageHeader from './MiniPageHeader';
import { BASE_API_URL } from '../../Shared/constants';
import { GET } from '../../Helpers/ApiHelpers';

type keyValue = {
  key: string;
  value: string;
  type: string;
};

interface navProps {
  value: string;
  icon: JSX.Element;
}

export interface ServiceDetails {
  id?: string;
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

const ServiceDetail = (): JSX.Element => {
  const { id } = useParams();
  const { search } = useLocation();
  const [content, setContent] = React.useState<ServiceDetails>({
    name: '',
    retries: 5,
    protocol: '',
    host: '',
    port: 80,
    path: '',
    connect_timeout: 60000,
    write_timeout: 60000,
    read_timeout: 60000,
  });
  const [loading, setLoading] = React.useState(true);
  const query = new URLSearchParams(search);
  const paramValue = query.get('newId');
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getService = async () => {
      if (paramValue === 'false') {
        const service = await GET({
          url: `${BASE_API_URL}/services/${id}`,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        setContent(service.data);
      }
      setLoading(false);
    };
    getService();
  }, [id, loading, paramValue]);

  const list: navProps[] = [
    { value: 'Service Details', icon: <IconInfoCircle /> },
    { value: 'Routes', icon: <AltRouteIcon /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
  ];
  const textFields: keyValue[] = [
    { key: 'name', value: 'The service name.', type: 'text' },
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
  ];
  return (
    <Box sx={{ width: '1250px', margin: 'auto' }}>
      <CssBaseline />
      <PageHeader
        header="Service"
        description="<a href='/services' style=color:'#79C2E3';text-decoration:none>service</a> / show"
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
        <NavPanel list={list} cur={list[0]} isNew={paramValue === 'true'} />
        <Box
          sx={{
            width: '1000px',
            alignContent: 'center',
          }}
        >
          <MiniPageHeader
            header="<b>Service Details</b>"
            icon={<IconInfoCircle />}
          />
          {loading ? (
            <Box
              sx={{ display: 'flex', height: '500px', alignItems: 'center' }}
            >
              <CircularProgress sx={{ margin: 'auto', color: '#1ABB9C' }} />
            </Box>
          ) : (
            <ServiceEditor service={content} textFields={textFields} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
