import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import PageHeader from '../Components/Features/PageHeader';

export default function Upstreams(): JSX.Element {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <PageHeader
        header="Upstreams"
        description='The upstream object represents a virtual hostname and can be used to loadbalance incoming requests over multiple services (targets). So for example an upstream named <span style="color: #D14E64">service.v1.xyz</span> with an API object created with
         an <span style="color: #D14E64">upstream_url=https://service.v1.xyz/some/path</span>. Requests for this API would be proxied to the targets defined within the upstream.'
      />
    </Box>
  );
}
