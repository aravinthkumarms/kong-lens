import * as React from 'react';
import Box from '@mui/material/Box';
import { Icon } from '@tabler/icons-react';

type PageHeaderProps = {
  header: string;
  icon: JSX.Element;
};

const MiniPageHeaderBox = ({ header, icon }: PageHeaderProps): JSX.Element => (
  <Box
    sx={{
      bgcolor: '#f5f5f5',
      padding: '15px',
      width: '1250px',
      height: '110px',

      display: 'flex',
    }}
  >
    <div style={{ fontSize: '20px', margin: 'auto' }}>
      {icon}
      {header}
    </div>
  </Box>
);

export default function MiniPageHeader({
  header,
  icon,
}: PageHeaderProps): JSX.Element {
  return <MiniPageHeaderBox header={header} icon={icon} />;
}
