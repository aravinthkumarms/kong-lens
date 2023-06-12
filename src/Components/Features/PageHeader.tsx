import * as React from 'react';
import parse from 'html-react-parser';
import Box from '@mui/material/Box';
import { PageHeaderDescProps } from '../../interfaces';

const PageHeaderBox = ({
  header,
  description,
}: PageHeaderDescProps): JSX.Element => (
  <Box
    sx={{
      bgcolor: '#f5f5f5',
      padding: '15px',
      width: '1250px',
      height: '110px',
      margin: 'auto',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <h3 style={{ fontSize: '28px', margin: '10px 0 11.5px' }}>{header}</h3>
    <p
      style={{
        fontSize: '14px',
        color: '#a6a6a6',
        margin: '5px 0 10px',
      }}
    >
      {parse(description)}
    </p>
  </Box>
);

export default function PageHeader({
  header,
  description,
}: PageHeaderDescProps): JSX.Element {
  return <PageHeaderBox header={header} description={description} />;
}
