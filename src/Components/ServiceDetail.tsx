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
  SERVICE_TEXT_FIELDS,
} from '../Shared/constants';
import { GET } from '../Helpers/ApiHelpers';
import { ServiceDetails, navBarProps, snackMessageProp } from '../interfaces';
import Routes from '../Pages/Routes';
import Plugins from '../Pages/Plugins';
import { SnackBarAlert } from './Features/SnackBarAlert';
import { updateValue } from '../Reducer/StoreReducer';

const ServiceDetail = (): JSX.Element => {
  const { id } = useParams();

  const { search } = useLocation();

  const dispatch = useDispatch();

  const list: navBarProps[] = [
    { value: 'Service Details', icon: <IconInfoCircle /> },
    { value: 'Routes', icon: <AltRouteIcon /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
  ];

  const [currentPage, setCurrentPage] = React.useState(list[0].value);

  const [number, setNumber] = React.useState(0);

  const handleCurrentPage = (value: string): void => {
    setCurrentPage(value);
    setNumber(() => number + 1);
  };

  const openSnackBar = useSelector(
    (state: { reducer: { openSnackBar: boolean } }) =>
      state.reducer.openSnackBar
  );

  const snack = useSelector(
    (state: { reducer: { snackBar: snackMessageProp } }) =>
      state.reducer.snackBar
  );

  const serviceData = useSelector(
    (state: { reducer: { serviceData: ServiceDetails } }) =>
      state.reducer.serviceData
  );

  const [loading, setLoading] = React.useState(true);

  const query = new URLSearchParams(search);

  const paramValue = query.get('newId');

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
              dispatch(
                updateValue({
                  type: ACTION_TYPES.UPDATE_SERVICE_DATA,
                  data: response.data,
                })
              );
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

  const renderComponent = {
    'Service Details': (
      <ServiceEditor service={serviceData} textFields={SERVICE_TEXT_FIELDS} />
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
        header={`Service ${serviceData.name}`}
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
                  backgroundColor:
                    currentPage === text.value ? '#1ABB9C' : 'white',
                  color: 'black',
                  borderRadius: '10px',
                }}
                onClick={() => {
                  !(paramValue === 'true')
                    ? handleCurrentPage(text.value)
                    : null;
                }}
                disablePadding
              >
                <ListItemButton
                  disabled={paramValue === 'true' && currentPage !== text.value}
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
            header={`<b>${currentPage}</b>`}
            icon={<IconInfoCircle />}
          />

          {loading ? (
            <Box
              sx={{ display: 'flex', height: '500px', alignItems: 'center' }}
            >
              <CircularProgress sx={{ margin: 'auto', color: '#1ABB9C' }} />
            </Box>
          ) : (
            renderComponent[currentPage as keyof typeof renderComponent]
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
