import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Service } from '../../Mocks/Service.mock';
import { updateValue } from '../../Reducer/ServiceReducer';

interface keyValue {
  key: string;
  value: string;
}

interface Props {
  service: Service;
  textFields: keyValue[];
}

const ServiceEditor = ({ service, textFields }: Props): JSX.Element => {
  const val = 0;
  const [currentService, setCurrentService] = React.useState(service);
  // const fields = [];
  // for (let i = 0; i < textFields.length(); i += 1) {
  //   fields;
  // }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOnSubmit = () => {
    dispatch(updateValue(currentService));
  };
  return (
    <>
      <br />
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  color: '#B2B2B2',
                }}
              >
                <TextField
                  key={text.value}
                  label={
                    text.key.charAt(0).toUpperCase() +
                    text.key.slice(1).replace('_', ' ')
                  }
                  InputLabelProps={{
                    shrink: true,
                    style: { fontSize: 20 },
                  }}
                  name={text.key}
                  variant="standard"
                  value={
                    currentService[text.key as keyof typeof currentService]
                  }
                  disabled={text.key === 'id'}
                  onChange={(e) => {
                    setCurrentService({
                      ...currentService,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
                <span style={{ fontSize: '13px' }}>{text.value}</span>
              </div>
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
          onClick={handleOnSubmit}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default ServiceEditor;
