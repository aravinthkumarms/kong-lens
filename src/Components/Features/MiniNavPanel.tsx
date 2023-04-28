import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as React from 'react';

interface navProps {
  value: string;
  icon: JSX.Element;
}

interface Props {
  list: navProps[];
  cur: navProps;
  isNew: boolean;
}

const NavPanel = ({ list, cur, isNew }: Props): JSX.Element => {
  const [current, setCurrent] = React.useState(cur.value);
  const [count, setCount] = React.useState(0);
  const handleCurrent = (value: string): void => {
    setCurrent(value);
    setCount(() => count + 1);
  };
  return (
    <Box sx={{ width: '200px' }}>
      <List>
        {list.map((text) => (
          <ListItem
            key={text.value}
            sx={{
              backgroundColor: current === text.value ? '#1ABB9C' : 'white',
              color: 'black',
              borderRadius: '10px',
            }}
            onClick={() => {
              !isNew ? handleCurrent(text.value) : null;
            }}
            disablePadding
          >
            <ListItemButton disabled={isNew && current !== text.value}>
              <ListItemIcon> {text.icon}</ListItemIcon>
              <ListItemText primary={text.value} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NavPanel;
