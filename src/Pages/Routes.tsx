import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';

export default function Routes(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PageHeader
        header="Routes"
        description="The Route entities defines rules to match client requests. Each Route is associated with a Service, and a Service may have multiple Routes associated to it. Every request matching a given Route will be proxied to its associated Service."
      />
    </Box>
  );
}
