import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ExtensionSharpIcon from '@mui/icons-material/ExtensionSharp';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { PluginBoxContainerProps } from '../interfaces';

const BoxHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  backgroundColor: '#f2f2f2',
  padding: '0.5rem',
});

// Define styles for the icon in the box header
const BoxIcon = styled(Box)({
  marginRight: '0.5rem',
});

const useStyles = makeStyles({
  root: {
    lineHeight: 2,
    borderRadius: 5,
  },
});

const PluginBoxContainer = ({
  icon,
  header,
  chips,
  coloredChipNames,
}: PluginBoxContainerProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box
      sx={{
        borderRadius: '10px',
        border: '1px',
        padding: '0.1rem',
        flex: 1,
        boxShadow: '5px 5px 5px lightgrey',
      }}
    >
      <BoxHeader>
        <BoxIcon>{icon}</BoxIcon>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {header}
        </Typography>
      </BoxHeader>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', gap: '10px 10px', alignItems: 'flex-start' }}
        >
          {chips.map((chip) => (
            <Chip
              className={classes.root}
              key={chip.name}
              label={chip.name}
              color={
                coloredChipNames.includes(chip.name) && chip.flag
                  ? 'success'
                  : undefined
              }
            />
          ))}
        </Stack>
        <br />
      </Box>
    </Box>
  );
};
const icon = (
  <span>
    <ExtensionSharpIcon />
  </span>
);
const header = 'PLUGINS';
const chips = [
  { name: 'responce-transformer', flag: true },
  { name: 'requst-termination', flag: true },
  { name: 'correlation-id', flag: true },
  { name: 'statsd', flag: true },
  { name: 'jwt', flag: false },
  { name: 'cors', flag: true },
  { name: 'basic-auth', flag: false },
  { name: 'key-auth', flag: true },
  { name: 'idap-auth', flag: false },
  { name: 'http-log', flag: true },
  { name: 'oauth2', flag: true },
  { name: 'hmac-auth', flag: true },
  { name: 'acl', flag: false },
  { name: 'datadog', flag: true },
  { name: 'tcp-log', flag: false },
  { name: 'ip-restriction', flag: true },
  { name: 'requst-transformer', flag: false },
  { name: 'file-log', flag: true },
  { name: 'bot-detection', flag: true },
  { name: 'loggly', flag: true },
  { name: 'requst-size-limiting', flag: false },
  { name: 'syslog', flag: true },
  { name: 'udp-log', flag: false },
  { name: 'aws-lambda', flag: false },
  { name: 'runscope', flag: true },
  { name: 'rate-limiting', flag: true },
];

const coloredChipNames = [
  'acl',
  'key-auth',
  'basic-auth',
  'cors',
  'oauth2',
  'rate-limiting',
  'request-termination',
  'response-ratelimiting',
];

export default function PluginBox(): JSX.Element {
  return (
    <PluginBoxContainer
      icon={icon}
      header={header}
      chips={chips}
      coloredChipNames={coloredChipNames}
    />
  );
}
