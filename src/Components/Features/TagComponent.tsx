import * as React from 'react';
import { Box } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import { TagProps } from '../../interfaces';

export const TagComponent = ({ tag, isList }: TagProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: !isList ? 'flex' : 'block',
        color: !isList ? '#1AAA9C' : 'black',
        margin: '1px',
        padding: '0',
        width: 'auto',
      }}
    >
      {isList ? (
        <div>{tag}</div>
      ) : (
        <div
          style={{
            width: 'auto',
            border: '1px Solid #1AAA9C',
            borderRadius: '10px',
            display: 'flex',
          }}
        >
          <SellIcon color="success" sx={{ width: '16px', margin: '2px' }} />
          <div style={{ margin: '2px 6px 2px 2px' }}>{tag}</div>
        </div>
      )}
    </Box>
  );
};
