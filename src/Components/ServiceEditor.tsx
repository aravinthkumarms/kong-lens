import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Stack,
  styled,
} from '@mui/material';
import Input from '@mui/joy/Input';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';
import { BASE_API_URL } from '../Shared/constants';
import { POST, PATCH } from '../Helpers/ApiHelpers';
import { SnackBarAlert } from './Features/SnackBarAlert';
import {
  ServiceDetails,
  ServiceEditorProps,
  snackMessageProp,
} from '../interfaces';

const StyledButton = styled(Button)({
  backgroundColor: '#1ABB9C',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1AAA9C',
  },
});

const ServiceEditor = ({
  service,
  textFields,
}: ServiceEditorProps): JSX.Element => {
  const [currentService, setCurrentService] =
    React.useState<ServiceDetails>(service);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  let { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramValue = query.get('newId');
  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOnCancel = (): void => {
    setCurrentService(service);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOnChange = (e: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preventDefault: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: { name: any; type: any; value: any };
  }) => {
    e.preventDefault;
    const { name, type, value } = e.target;
    setCurrentService({
      ...currentService,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleListChange = (
    key: keyof typeof service,
    value: string[]
  ): void => {
    currentService[key] = value;
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const postService = async () => {
      if (paramValue === 'true') {
        setLoading(true);
        await POST({
          url: `${BASE_API_URL}/services`,
          body: currentService,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            id = response.data.id;
            if (response.status === 201) {
              navigate(`../services/${id}/?newId=false`, { replace: true });
              setSnack({
                message: 'Successfully created service',
                severity: 'success',
              });
            }
          })
          .catch((err) => {
            setSnack({
              message:
                err.response.data.message ||
                'Unable to save data, Please try again',
              severity: 'error',
            });
          });
        setOpen(true);
        setLoading(false);
      } else {
        setLoading(true);
        await PATCH({
          url: `${BASE_API_URL}/services/${id}`,
          body: currentService,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 200) {
              setSnack({
                message: 'Successfully modified service',
                severity: 'success',
              });
            }
          })
          .catch((err) => {
            setSnack({
              message:
                err.response.data.message || 'Could not able to fetch data',
              severity: 'error',
            });
          });
        setOpen(true);
        setLoading(false);
      }
    };
    postService();
  };

  return (
    <>
      <SnackBarAlert
        open={open}
        message={snack.message}
        severity={snack.severity}
        handleClose={handleClose}
      />
      <br />
      {loading ? (
        <Box sx={{ display: 'flex', height: '500px', alignItems: 'center' }}>
          <CircularProgress sx={{ margin: 'auto', color: '#1ABB9C' }} />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            gap: '24px',
            margin: 'auto',
          }}
        >
          <form onSubmit={handleOnSubmit}>
            <Stack
              sx={{
                width: '80%',
                gap: '24px',
                margin: 'auto',
              }}
            >
              {textFields.map((text) => (
                <div
                  key={text.key}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <InputLabel sx={{ fontSize: 16, color: '#1ABB9C' }}>
                    {text.key.charAt(0).toUpperCase() +
                      text.key.slice(1).replace('_', ' ')}
                  </InputLabel>
                  {text.type === 'list' && (
                    <TagsInput
                      value={currentService[text.key as keyof typeof service]}
                      onChange={(e) => {
                        handleListChange(text.key as keyof typeof service, e);
                      }}
                    />
                  )}
                  {text.type !== 'list' && (
                    <Input
                      sx={{
                        borderRadius: '5px',
                      }}
                      type={text.type}
                      name={text.key}
                      value={currentService[text.key as keyof typeof service]}
                      onChange={handleOnChange}
                    />
                  )}
                  <span style={{ fontSize: '13px', color: '#B2B2B2' }}>
                    {text.value}
                  </span>
                </div>
              ))}
            </Stack>
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
              <StyledButton variant="contained" onClick={handleOnCancel}>
                Cancel
              </StyledButton>
              <StyledButton variant="contained" type="submit">
                Submit
              </StyledButton>
            </Box>
          </form>
        </Box>
      )}
    </>
  );
};

export default ServiceEditor;
