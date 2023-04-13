import * as React from 'react';
import Box from '@mui/material/Box';

type PageHeaderProps = {
  header: string;
  description: string;
};

const PageHeaderBox = ({
  header,
  description,
}: PageHeaderProps): JSX.Element => (
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
      {description}
    </p>
  </Box>
);

export default function PageHeader({
  header,
  description,
}: PageHeaderProps): JSX.Element {
  return <PageHeaderBox header={header} description={description} />;
}
