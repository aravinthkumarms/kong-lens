import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';

export default function Certificates(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PageHeader
        header="Certificates"
        description="A certificate object represents a public certificate/private key pair for an SSL certificate. These objects are used by Kong to handle SSL/TLS termination for encrypted requests. Certificates are optionally associated with SNI objects to tie a cert/key pair to one or more hostnames."
      />
    </Box>
  );
}
