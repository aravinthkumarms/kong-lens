import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

// Define styles for the box header
const BoxHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  backgroundColor: '#F9A825',
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
export default function ExampleBox({ icon, name, keyValues }: ExampleBoxProps){
  return (
    <Box sx={{ border: '1px solid black', padding: '1rem', flex: 1 }}>
      {/* Box header */}
      <BoxHeader>
        <BoxIcon>{icon}</BoxIcon>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          {name}
        </Typography>
      </BoxHeader>

      {/* Key value fields */}
      {keyValues.map((kv) => (
        <KeyValueField key={kv.key}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
            {kv.key}:
          </Typography>
          <Typography variant="body1">{kv.value}</Typography>
        </KeyValueField>
      ))}
    </Box>
  );
};

// Example usage
const icon1 = <span>🌟</span>;
const name1 = 'Box 1';
const keyValues1 = [
  { key: 'Field 1', value: 'Value 1' },
  { key: 'Field 2', value: 'Value 2' },
  { key: 'Field 3', value: 'Value 3' },
  { key: 'Field 4', value: 'Value 4' },
  { key: 'Field 5', value: 'Value 5' },
];

const icon2 = <span>🌟</span>;
const name2 = 'Box 2';
const keyValues2 = [
  { key: 'Field 1', value: 'Value 1' },
  { key: 'Field 2', value: 'Value 2' },
];

const icon3 = <span>🌟</span>;
const name3 = 'Box 3';
const keyValues3 = [
  { key: 'Field 1', value: 'Value 1' },
  { key: 'Field 2', value: 'Value 2' },
  { key: 'Field 3', value: 'Value 3' },
];

export const Dashboard = () => {
  return (
    <BoxContainer>
      <ExampleBox icon={icon1} name={name1} keyValues={keyValues1} />
      <ExampleBox icon={icon2} name={name2} keyValues={keyValues2} />
      <ExampleBox icon={icon3} name={name3} keyValues={keyValues3} />
    </BoxContainer>
  );
};


