import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ExtensionIcon from '@mui/icons-material/Extension';

type ExampleBoxProps = {
  icon: React.ReactNode;
  header: string;
  chips: { name: string; flag: boolean }[];
  coloredChipNames: string[];
};

const ExampleBox = ({
  icon,
  header,
  chips,
  coloredChipNames,
}: ExampleBoxProps): JSX.Element => (
  <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '12px', p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box
        sx={{
          width: '24px',
          height: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6">{header}</Typography>
    </Box>
    <Box>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        sx={{ alignItems: 'center' }}
      >
        {chips.map((chip) => (
          <Chip
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
    </Box>
  </Box>
);

const icon = (
  <span>
    <ExtensionIcon />
  </span>
);
const header = 'Example Header';
const chips = [
  { name: 'acl', flag: true },
  { name: 'key-auth', flag: true },
  { name: 'basic-auth', flag: true },
  { name: 'cors', flag: false },
  { name: 'oauth2', flag: true },
  { name: 'rate-limiting', flag: false },
  { name: 'request-termination', flag: true },
  { name: 'response-ratelimiting', flag: false },
  { name: 'acl', flag: true },
  { name: 'key-auth', flag: true },
  { name: 'basic-auth', flag: true },
  { name: 'cors', flag: false },
  { name: 'oauth2', flag: true },
  { name: 'rate-limiting', flag: false },
  { name: 'request-termination', flag: true },
  { name: 'response-ratelimiting', flag: false },
  { name: 'acl', flag: true },
  { name: 'key-auth', flag: true },
  { name: 'basic-auth', flag: true },
  { name: 'cors', flag: false },
  { name: 'oauth2', flag: true },
  { name: 'rate-limiting', flag: false },
  { name: 'request-termination', flag: true },
  { name: 'response-ratelimiting', flag: false },
  { name: 'acl', flag: true },
  { name: 'key-auth', flag: true },
  { name: 'basic-auth', flag: true },
  { name: 'cors', flag: false },
  { name: 'oauth2', flag: true },
  { name: 'rate-limiting', flag: false },
  { name: 'request-termination', flag: true },
  { name: 'response-ratelimiting', flag: false },
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
    <Box>
      <ExampleBox
        icon={icon}
        header={header}
        chips={chips}
        coloredChipNames={coloredChipNames}
      />
    </Box>
  );
}
