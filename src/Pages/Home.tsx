/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import PeopleIcon from '@mui/icons-material/People';
import CloudIcon from '@mui/icons-material/Cloud';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import PersonIcon from '@mui/icons-material/Person';
import ExtensionIcon from '@mui/icons-material/Extension';
import StreamIcon from '@mui/icons-material/Stream';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import CastIcon from '@mui/icons-material/Cast';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Dashboard } from './Dashboard';
import PluginBox from '../Components/Features/PluginBox';
import Info from './Info';
import MenuItem from '../Components/Features/MenuItem';
import Routes from './Routes';
import Consumers from './Consumers';
import Plugins from './Plugins';
import Upstreams from './Upstreams';
import Certificates from './Certificates';
import Users from './Users';
import Connections from './Connections';
import Settings from './Settings';
import Services from './Services';
import ServiceDetail from '../Components/ServiceDetail';
import RouteDetail from '../Components/RouteDetail';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface KeyValue {
  key: string;
  value: string;
}
const icon = <span>🌟</span>;
const name = 'Example Box';
const keyValues: KeyValue[] = [
  { key: 'Host Name', value: 'www.google.com' },
  { key: 'Tag Line', value: 'Welcome to Kong' },
  { key: 'Version', value: '1.3.0' },
  { key: 'Lua Version', value: 'Lua 1.2.3' },
  { key: 'Admin Listen', value: '[127.0.0.0:8001, 127.0.0.0:8004]' },
];

const renderPages: { [page: string]: JSX.Element } = {
  dashboard: <Dashboard />,
  info: <Info />,
  services: <Services />,
  routes: <Routes type="separate" />,
  consumers: <Consumers />,
  plugins: <Plugins type="separate" />,
  upstreams: <Upstreams />,
  certificates: <Certificates />,
  users: <Users />,
  connections: <Connections />,
  snapshots: <Info />,
  settings: <Settings />,
  servicesDetail: <ServiceDetail />,
  routesDetail: <RouteDetail />,
};

// const getPage = ({ props }: any) => {
//   return renderPages[props.page]
// };

type MiniDrawerProps = {
  path: string;
};

export default function MiniDrawer({ path }: MiniDrawerProps): JSX.Element {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<JSX.Element>();

  function setPage(page: string): void {
    setCurrentPage(renderPages[page]);
  }

  const handleDrawerOpen = (): void => {
    setOpen(true);
  };

  React.useEffect(() => {
    setPage(path);
  }, [currentPage, path]);

  const navigate = useNavigate();

  const navigateToPage = (page: string): void => {
    navigate(`/${page}`);
  };

  const handlePageRender = (page: string): void => {
    setPage(page);
    navigateToPage(page);
  };

  const handleDrawerClose = (): void => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: '#2a3f54' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Kong Lens
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ bgcolor: '#2a3f54' }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{
              display: 'block',
            }}
          >
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="dashboard"
              icon={<DashboardIcon />}
              curLocation={path}
            />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{
              display: 'block',
            }}
          >
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="info"
              icon={<InfoIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="services"
              icon={<CloudIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="routes"
              icon={<AltRouteIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="consumers"
              icon={<PersonIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="plugins"
              icon={<ExtensionIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="upstreams"
              icon={<StreamIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="certificates"
              icon={<SecurityIcon />}
              curLocation={path}
            />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="users"
              icon={<PeopleIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="connections"
              icon={<CastIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="snapshots"
              icon={<FolderCopyIcon />}
              curLocation={path}
            />
            <MenuItem
              open={open}
              handlePageRender={handlePageRender}
              page="settings"
              icon={<SettingsIcon />}
              curLocation={path}
            />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {currentPage}
        {/* <hr />
        <PluginBox /> */}
      </Box>
    </Box>
  );
}
