import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';
import { PageTypeProps } from '../interfaces';

export default function Plugins({ type }: PageTypeProps): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {type === 'separate' && (
        <PageHeader
          header="Plugins"
          description="A Plugin entity represents a plugin configuration that will be executed during the HTTP request/response workflow, and it's how you can add functionalities to APIs that run behind Kong, like Authentication or Rate Limiting for example."
        />
      )}
    </Box>
  );
}
