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
import { useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import ExtensionIcon from '@mui/icons-material/Extension';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from './Features/PageHeader';
import MiniPageHeader from './Features/MiniPageHeader';
import {
  ACTION_TYPES,
  API_RESPONSE_SNACK_MESSAGE,
  BASE_API_URL,
  ROUTE_DETAILS_INTERFACE,
  ROUTE_TEXT_FIELDS,
} from '../Shared/constants';
import { GET } from '../Helpers/ApiHelpers';
import { RouteDetails, navBarProps, snackMessageProp } from '../interfaces';
import RouteEditor from './RouteEditor';
import Plugins from '../Pages/Plugins';
import { SnackBarAlert } from './Features/SnackBarAlert';
import { updateValue } from '../Reducer/StoreReducer';

const RouteDetail = (): JSX.Element => {
  const { id } = useParams();
  const [content, setContent] = React.useState<RouteDetails>(
    ROUTE_DETAILS_INTERFACE
  );
  const [loading, setLoading] = React.useState(false);
  const list: navBarProps[] = [
    { value: 'Route Details', icon: <IconInfoCircle /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
  ];
  const [current, setCurrent] = React.useState(list[0].value);

  const [number, setNumber] = React.useState(0);

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
  const handleCurrent = (value: string): void => {
    setCurrent(value);
    setNumber(() => number + 1);
  };
  const preProcess = (data: RouteDetails): RouteDetails => {
    const keyList = Object.keys(data);
    for (let i = 0; i < keyList.length; i += 1) {
      const key = keyList[i];
      if (
        data[key as keyof typeof data] === null ||
        data[key as keyof typeof data] === undefined
      )
        // eslint-disable-next-line no-param-reassign
        data[key as keyof typeof data] = [];
    }
    if (Object.keys(data.headers).length === 0) {
      // eslint-disable-next-line no-param-reassign
      data.headers = [];
    } else {
      const headers = [];
      const keys = Object.keys(data.headers);
      for (let j = 0; j < keys.length; j += 1) {
        headers.push(keys[j].concat(`:${data.headers[keys[j]]}`));
      }
      // eslint-disable-next-line no-param-reassign
      data.headers = headers;
    }
    return data;
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getData = async () => {
      setLoading(true);
      await GET({
        url: `${BASE_API_URL}/routes/${id}/`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
        .then((response) => {
          if (response.status === 200) {
            updateSnackMessage(
              API_RESPONSE_SNACK_MESSAGE.fetchedData,
              'success'
            );
            setContent(preProcess(response.data));
          }
        })
        .catch((err) => {
          updateSnackMessage(
            err.response
              ? err.response.data.message
              : API_RESPONSE_SNACK_MESSAGE.unableToFetchData,
            'error'
          );
        });
      setLoading(false);
    };
    updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const renderComponent = {
    'Route Details': (
      <RouteEditor
        content={content}
        textFields={ROUTE_TEXT_FIELDS}
        param={false}
      />
    ),
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
                  handleCurrent(text.value);
                }}
                disablePadding
              >
                <ListItemButton>
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

export default RouteDetail;
