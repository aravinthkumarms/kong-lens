import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  styled,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../../Shared/constants';
import { POST, PATCH } from '../../../Helpers/ApiHelpers';
import { SnackBarAlert } from '../SnackBarAlert';
import {
  EditorProps,
  snackMessageProp,
  ServiceDetails,
} from '../../../interfaces';

const StyledButton = styled(Button)({
  backgroundColor: '#1ABB9C',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1AAA9C',
  },
});

const inputLabelStyle = {
  shrink: true,
  style: {
    fontSize: 20,
    color: '#1ABB9C',
    margin: 'auto',
  },
};

const Editor = ({ content, textFields, navPath }: EditorProps): JSX.Element => {
  const [currentContent, setCurrentContent] =
    React.useState<typeof content>(content);
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
    setCurrentContent(content);
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
    setCurrentContent({
      ...currentContent,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const postService = async () => {
      if (paramValue === 'true') {
        setLoading(true);
        await POST({
          url: `${BASE_API_URL}/services`,
          body: currentContent,
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
          url: `${BASE_API_URL}/${navPath}/${id}`,
          body: currentContent,
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
              {textFields.map((text, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <TextField
                    label={
                      text.key.charAt(0).toUpperCase() +
                      text.key.slice(1).replace('_', ' ')
                    }
                    type={text.type}
                    InputLabelProps={inputLabelStyle}
                    name={text.key}
                    variant="standard"
                    value={currentContent[text.key as keyof typeof content]}
                    disabled={text.key === 'id'}
                    onChange={handleOnChange}
                  />
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

export default Editor;
