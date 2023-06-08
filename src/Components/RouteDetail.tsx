import { Box, CssBaseline, Divider } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import ExtensionIcon from '@mui/icons-material/Extension';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from './Features/PageHeader';
import NavPanel from './Features/MiniNavPanel';
import MiniPageHeader from './Features/MiniPageHeader';
import {
  BASE_API_URL,
  RouteDetailsInterface,
  RouteTextFields,
} from '../Shared/constants';
import { GET } from '../Helpers/ApiHelpers';
import { RouteDetails, navBarProps } from '../interfaces';
import RouteEditor from './RouteEditor';

const RouteDetail = (): JSX.Element => {
  const { id } = useParams();
  const [content, setContent] = React.useState<RouteDetails>(
    RouteDetailsInterface
  );
  const [loading, setLoading] = React.useState(false);

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
      const { data } = await GET({
        url: `${BASE_API_URL}/routes/${id}/`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      setContent(preProcess(data));
      setLoading(false);
    };
    getData();
  }, [id]);

  const list: navBarProps[] = [
    { value: 'Route Details', icon: <IconInfoCircle /> },
    { value: 'Plugins', icon: <ExtensionIcon /> },
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
              textFields={RouteTextFields}
              param={false}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RouteDetail;
