import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ExtensionIcon from '@mui/icons-material/Extension';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from './Features/PageHeader';
import ServiceEditor from './ServiceEditor';
import MiniPageHeader from './Features/MiniPageHeader';
import {
  ACTION_TYPES,
  API_RESPONSE_SNACK_MESSAGE,
  BASE_API_URL,
} from '../Shared/constants';
import { GET } from '../Helpers/ApiHelpers';
import {
  ServiceDetails,
  keyValueType,
  navBarProps,
  snackMessageProp,
} from '../interfaces';
import Routes from '../Pages/Routes';
import Plugins from '../Pages/Plugins';
import { SnackBarAlert } from './Features/SnackBarAlert';
import { updateValue } from '../Reducer/StoreReducer';

const ServiceDetail = (): JSX.Element => {
  const { id } = useParams();
  const { search } = useLocation();
  const list: navBarProps[] = [
    { value: 'Service Details', icon: <IconInfoCircle /> },
    { value: 'Routes', icon: <AltRouteIcon /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
  ];
  const [current, setCurrent] = React.useState(list[0].value);
  const [number, setNumber] = React.useState(0);
  const handleCurrent = (value: string): void => {
    setCurrent(value);
    setNumber(() => number + 1);
  };

  const [content, setContent] = React.useState<ServiceDetails>({
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
  });
  const [loading, setLoading] = React.useState(true);
  const query = new URLSearchParams(search);
  const paramValue = query.get('newId');
  const openSnackBar = useSelector(
    (state: { reducer: { openSnackBar: boolean } }) =>
      state.reducer.openSnackBar
  );
  const snack = useSelector(
    (state: { reducer: { snackBar: snackMessageProp } }) =>
      state.reducer.snackBar
  );
  const dispatch = useDispatch();

  const updateFlagReducer = (type: string, value: boolean): void => {
    dispatch(updateValue({ type, value }));
  };

  const updateSnackMessage = (message: string, severity: string): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.SET_SNACK_BAR_MESSAGE,
        message,
        severity,
      })
    );
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getService = async () => {
      if (paramValue === 'false') {
        await GET({
          url: `${BASE_API_URL}/services/${id}`,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 200) {
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.fetchedData,
                'success'
              );
              setContent(response.data);
            }
          })
          .catch((err) => {
            updateSnackMessage(
              err.response && err.response.data
                ? err.response.data.message
                : API_RESPONSE_SNACK_MESSAGE.unableToSaveData,
              'error'
            );
          });
        updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
      }
      setLoading(false);
    };
    getService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading, paramValue]);

  const textFields: keyValueType[] = [
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
  const renderComponent = {
    'Service Details': (
      <ServiceEditor service={content} textFields={textFields} />
    ),
    Routes: <Routes type="nested" />,
    Plugins: <Plugins type="nested" />,
  };
  return (
    <Box sx={{ width: '1250px', margin: 'auto' }}>
      <SnackBarAlert
        open={openSnackBar}
        message={snack.message}
        severity={snack.severity}
        handleClose={() => {
          updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, false);
        }}
      />
      <br />
      <CssBaseline />
      <PageHeader
        header={`Service ${content.name}`}
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
        <Box sx={{ width: '200px' }}>
          <List>
            {list.map((text) => (
              <ListItem
                key={text.value}
                sx={{
                  backgroundColor: current === text.value ? '#1ABB9C' : 'white',
                  color: 'black',
                  borderRadius: '10px',
                }}
                onClick={() => {
                  !(paramValue === 'true') ? handleCurrent(text.value) : null;
                }}
                disablePadding
              >
                <ListItemButton
                  disabled={paramValue === 'true' && current !== text.value}
                >
                  <ListItemIcon> {text.icon}</ListItemIcon>
                  <ListItemText primary={text.value} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            width: '1000px',
            alignContent: 'center',
          }}
        >
          <MiniPageHeader
            header={`<b>${current}</b>`}
            icon={<IconInfoCircle />}
          />

          {loading ? (
            <Box
              sx={{ display: 'flex', height: '500px', alignItems: 'center' }}
            >
              <CircularProgress sx={{ margin: 'auto', color: '#1ABB9C' }} />
            </Box>
          ) : (
            renderComponent[current as keyof typeof renderComponent]
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
