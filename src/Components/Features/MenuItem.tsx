import { ListItemButton, ListItemText } from '@mui/material';
import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { MenuItemProps } from '../../interfaces';



const MenuItemElement = ({
  open,
  handlePageRender,
  page,
  icon,
  curLocation,
}: MenuItemProps): JSX.Element => (
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: curLocation.includes(page) ? '#2a3f54' : '#FFFFFF',
    }}
    onClick={() => {
      handlePageRender(page);
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      {icon}
    </ListItemIcon>
    <ListItemText primary={page.toUpperCase()} sx={{ opacity: open ? 1 : 0 }} />
  </ListItemButton>
);

export default function MenuItem({
  open,
  handlePageRender,
  page,
  icon,
  curLocation,
}: MenuItemProps): JSX.Element {
  return (
    <MenuItemElement
      open={open}
      handlePageRender={handlePageRender}
      page={page}
      icon={icon}
      curLocation={curLocation}
    />
  );
}
