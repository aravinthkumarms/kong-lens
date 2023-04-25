import * as React from 'react';
import Box from '@mui/material/Box';
import parse from 'html-react-parser';

type PageHeaderProps = {
  header: string;
  icon: JSX.Element;
};

const MiniPageHeaderBox = ({ header, icon }: PageHeaderProps): JSX.Element => (
  <Box
    sx={{
      bgcolor: '#f5f5f5',
      padding: '15px',
      width: '1000px',
      height: '110px',
      marginTop: '10px',
      display: 'flex',
    }}
  >
    <div
      style={{
        fontSize: '20px',
        margin: 'auto',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {icon}
      {parse(header)}
    </div>
  </Box>
);

export default function MiniPageHeader({
  header,
  icon,
}: PageHeaderProps): JSX.Element {
  return <MiniPageHeaderBox header={header} icon={icon} />;
}
