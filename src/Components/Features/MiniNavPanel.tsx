import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as React from 'react';

interface Props {
  list: string[];
  cur: string;
  isNew: boolean;
}

const NavPanel = ({ list, cur, isNew }: Props): JSX.Element => {
  const [current, setCurrent] = React.useState(cur);
  const [count, setCount] = React.useState(0);
  const handleCurrent = (value: string): void => {
    setCurrent(value);
    setCount(() => count + 1);
  };
  return (
    <Box sx={{ width: '200px' }}>
      <List>
        {list.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              sx={{
                backgroundColor: current === text ? 'teal' : 'white',
              }}
              onClick={() => {
                handleCurrent(text);
              }}
              disabled={isNew && current !== text}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NavPanel;
