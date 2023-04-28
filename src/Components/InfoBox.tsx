import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';

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

interface KeyValue {
  key: string;
  value: string;
}

interface InfoBoxProps {
  icon: React.ReactNode;
  name: string;
  keyValues: KeyValue[];
}

// Define the box component
export default function InfoBox({ icon, name, keyValues }: InfoBoxProps): JSX.Element {
  return (
    <Box sx={{ 'border-radius': '10px', border: '1px', padding: '0.1rem', flex: 1, 'box-shadow': '5px 5px 5px lightgrey' }}>
      {/* Box header */}
      <BoxHeader>
        <BoxIcon>{icon}</BoxIcon>
        <Typography variant="h6" sx={{ color: 'black' }}>
          {name}
        </Typography>
      </BoxHeader>
      <Table>
        <TableBody>
          {keyValues.map((kv) => (
              <TableRow key={kv.key}>
                <TableCell style={{fontWeight:'bold'}}>{kv.key}</TableCell>
                <TableCell style={{textShadow: '0 0 20px grey'}}>{kv.value}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
}