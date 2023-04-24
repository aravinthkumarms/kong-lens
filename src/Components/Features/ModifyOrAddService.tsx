import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { TextInput } from '@mantine/core';
import { Service } from '../../Mocks/Service.mock';

interface Props {
  service: Service;
  textFields: string[];
}

const ServiceEditor = ({ service, textFields }: Props): JSX.Element => {
  const val = 0;
  return (
    <Divider>
      <Typography sx={{ margin: 'auto' }}>Create New Service</Typography>
      <Box
        sx={{
          width: '100%',
          gap: '24px',
          margin: 'auto',
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '80%',
              gap: '24px',
              margin: 'auto',
            }}
          >
            {textFields.map((text) => (
              <TextInput
                key={text}
                label={text}
                name={text}
                value={service[text as keyof typeof service]}
                disabled={text === 'id'}
                // onChange={(e) =>
                //   setValues({ ...values, [e.target.name]: e.target.value })
                // }
              />
            ))}
          </Stack>
        </form>
      </Box>
      <Box
        sx={{
          padding: '20px',
          width: '100%',
          justifyContent: 'center',
          gap: '16px',
          margin: 'auto',
          display: 'flex',
        }}
      >
        <Button
          // onClick={onClose}
          sx={{
            backgroundColor: 'teal',
            color: 'white',
          }}
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          // onClick={handleSubmit}
          sx={{
            backgroundColor: 'teal',
            color: 'white',
          }}
          variant="contained"
        >
          Submit
        </Button>
      </Box>
    </Divider>
  );
};

export default ServiceEditor;
