import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import LanIcon from '@mui/icons-material/Lan';
import StorageIcon from '@mui/icons-material/Storage';

// Define styles for the box header
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

// Define styles for the key value fields in the box
const KeyValueField = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.5rem',
});

// Define the container for the three boxes
const BoxContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '1rem',
});

interface KeyValue {
  key: string;
  value: string;
}

interface ExampleBoxProps {
  icon: React.ReactNode;
  name: string;
  keyValues: KeyValue[];
}

// Define the box component
const ExampleBox = ({ icon, name, keyValues }: ExampleBoxProps) => (
  <Box sx={{ border: '1px solid black', padding: '0.1rem', flex: 1 }}>
    {/* Box header */}
    <BoxHeader>
      <BoxIcon>{icon}</BoxIcon>
      <Typography variant="h6" sx={{ color: 'black' }}>
        {name}
      </Typography>
    </BoxHeader>

    {/* Key value fields */}
    {keyValues.map((kv, index) => (
      <KeyValueField key={kv.key}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', marginRight: '0.5rem' }}
        >
          {kv.key}:
        </Typography>
        <Typography variant="body1">{kv.value}</Typography>
      </KeyValueField>
    ))}
  </Box>
);

// Example usage
const icon1 = (
  <span>
    <InfoIcon />
  </span>
);
const name1 = 'NODE INFO';
const keyValues1 = [
  { key: 'Host Name', value: 'dazzling-ocean-1234.example.com' },
  { key: 'Tag Line', value: 'Value 2' },
  { key: 'Version', value: 'Value 3' },
  { key: 'LUA Version', value: 'Value 4' },
  { key: 'Admin Listen', value: '["127.0.0.0:8001", "127.0.0.0:8444"]' },
];

const icon2 = (
  <span>
    <LanIcon />
  </span>
);
const name2 = 'CONNECTIONS';
const keyValues2 = [
  { key: 'Active', value: '4' },
  { key: 'Reading', value: '0' },
  { key: 'Writing', value: '1' },
  { key: 'Waiting', value: '3' },
  { key: 'Total Requests', value: '77k+' },
];

const icon3 = (
  <span>
    <StorageIcon />
  </span>
);
const name3 = 'DATABASE INFO';
const keyValues3 = [
  { key: 'DBMS', value: 'postgres' },
  { key: 'Host', value: 'mydatabase.abcdefghijk.us-west-2.rds.amazonaws.com' },
  { key: 'Database', value: 'kong_api_gateway' },
  { key: 'User', value: 'kong_api_gateway' },
  { key: 'Port', value: '5432' },
];

export const Dashboard = () => (
  <BoxContainer>
    <ExampleBox icon={icon1} name={name1} keyValues={keyValues1} />
    <ExampleBox icon={icon2} name={name2} keyValues={keyValues2} />
    <ExampleBox icon={icon3} name={name3} keyValues={keyValues3} />
  </BoxContainer>
);
