import { Box, CssBaseline, Divider } from '@mui/material';
import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import CircularProgress from '@mui/material/CircularProgress';
import PageHeader from '../PageHeader';
import NavPanel from '../MiniNavPanel';
import MiniPageHeader from '../MiniPageHeader';
import { BASE_API_URL } from '../../../Shared/constants';
import { GET } from '../../../Helpers/ApiHelpers';
import { DetailViewerProps, ServiceDetails } from '../../../interfaces';
import Editor from './Editor';

const DetailViewer = ({
  navList,
  textFields,
  pageHeader,
  pageDesc,
}: DetailViewerProps): JSX.Element => {
  const { id } = useParams();
  const { search } = useLocation();
  const headerNav = `${pageHeader.toLowerCase()}s`;
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
    const getData = async () => {
      if (paramValue === 'false') {
        const response = await GET({
          url: `${BASE_API_URL}/${headerNav}/${id}`,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
        setContent(response.data);
      }
      setLoading(false);
    };
    getData();
  }, [id, loading, headerNav, paramValue]);

  return (
    <Box sx={{ width: '1250px', margin: 'auto' }}>
      <CssBaseline />
      <PageHeader
        header={`${pageHeader} ${content.name}`}
        description={`<a href='/${headerNav}' style=color:'#79C2E3';text-decoration:none>${pageDesc}</a> / show`}
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
        <NavPanel
          list={navList}
          cur={navList[0]}
          isNew={paramValue === 'true'}
        />
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
            <Editor
              content={content}
              textFields={textFields}
              navPath={headerNav}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetailViewer;
