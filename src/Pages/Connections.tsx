import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';

export default function Connections(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PageHeader
        header="Connections"
        description="Create connections to Kong Nodes and activate the one you want use."
      />
    </Box>
  );
}
