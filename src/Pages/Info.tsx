import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';

export default function Info(): JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <PageHeader
        header="Node Item"
        description="Generic details about the node"
      />
    </Box>
  );
}
