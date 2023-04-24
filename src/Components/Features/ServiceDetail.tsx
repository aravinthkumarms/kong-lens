import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
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

const ServiceDetail = (): JSX.Element => {
  const { isNew } = useParams();
  const content: Service = useSelector((state: RootState) => state.service);
  const list = ['Service Details', 'Routes', 'Plugins'];
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
          <MiniPageHeader header="Service Details" icon={<IconInfoCircle />} />
          <ServiceEditor service={content} textFields={Object.keys(content)} />
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceDetail;
