import { Box, CssBaseline, Divider } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconInfoCircle } from '@tabler/icons-react';
import PageHeader from './PageHeader';
import NavPanel from './MiniNavPanel';
import ServiceEditor from './ModifyOrAddService';
import { Service } from '../../Mocks/Service.mock';
import { RootState } from '../../Reducer/Store';
import MiniPageHeader from './MiniPageHeader';

type keyValue = {
  key: string;
  value: string;
};

const ServiceDetail = (): JSX.Element => {
  const { isNew } = useParams();
  const content: Service = useSelector((state: RootState) => state.service);
  const list = ['Service Details', 'Routes', 'Plugins'];
  const textFields: keyValue[] = [
    { key: 'name', value: 'The service name.' },
    {
      key: 'protocol',
      value:
        'The protocol used to communicate with the upstream. It can be one of http or https.',
    },

    { key: 'host', value: 'The host of the upstream server.' },
    { key: 'port', value: 'The upstream server port. Defaults to 80.' },

    {
      key: 'path',
      value:
        'The path to be used in requests to the upstream server. Empty by default.',
    },

    {
      key: 'retries',
      value:
        'The number of retries to execute upon failure to proxy. The default is 5.',
    },

    {
      key: 'connect_timeout',
      value:
        'The timeout in milliseconds for establishing a connection to your upstream server. Defaults to 60000',
    },

    {
      key: 'write_timeout',
      value:
        'The timeout in milliseconds between two successive write operations for transmitting a request to the upstream server. Defaults to 60000',
    },

    {
      key: 'read_timeout',
      value:
        'The timeout in milliseconds between two successive read operations for transmitting a request to the upstream server. Defaults to 60000',
    },
  ];
  return (
    <Box sx={{ width: '1250px', margin: 'auto' }}>
      <CssBaseline />

      <PageHeader
        header="Service"
        description="<a href='/services' style=color:'#79C2E3';text-decoration:none>service</a> / service"
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
        <NavPanel list={list} cur={list[0]} isNew={isNew === 'true'} />
        <Box
          sx={{
            width: '1000px',
          }}
        >
          <MiniPageHeader
            header="<b>Service Details</b>"
            icon={<IconInfoCircle />}
          />

          <ServiceEditor service={content} textFields={textFields} />
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
