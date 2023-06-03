/* eslint-disable dot-notation */
import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  styled,
  InputLabel,
} from '@mui/material';

import { useParams } from 'react-router-dom';
import { Input, Switch, Typography } from '@mui/joy';
import { TagsInput } from 'react-tag-input-component';
import { BASE_API_URL } from '../Shared/constants';
import { PATCH } from '../Helpers/ApiHelpers';
import { SnackBarAlert } from './Features/SnackBarAlert';
import {
  EditorProps,
  RouteDetails,
  snackMessageProp,
  toggleProps,
} from '../interfaces';

const StyledButton = styled(Button)({
  backgroundColor: '#1ABB9C',
  color: 'white',
  '&:hover': {
    backgroundColor: '#1AAA9C',
  },
});

function ExampleTrackChild({ yes, onChange }: toggleProps): JSX.Element {
  const [checked, setChecked] = React.useState<boolean>(yes);
  return (
    <Switch
      checked={checked}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        setChecked(value);
        onChange();
      }}
      slotProps={{
        track: {
          children: (
            <>
              <Typography component="span" level="inherit" sx={{ ml: '4px' }}>
                YES
              </Typography>
              <Typography component="span" level="inherit" sx={{ mr: '8px' }}>
                NO
              </Typography>
            </>
          ),
        },
      }}
      sx={{
        '--Switch-thumbSize': '27px',
        '--Switch-trackWidth': '64px',
        '--Switch-trackHeight': '31px',
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '8px 0px',
      }}
    />
  );
}

const RouteEditor = ({ content, textFields }: EditorProps): JSX.Element => {
  const [currentContent, setCurrentContent] =
    React.useState<RouteDetails>(content);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  const [toggleData, setToggleData] = React.useState({
    strip_path: false,
    preserve_host: false,
  });
  const { id } = useParams();
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

  const preProcess = (data: RouteDetails): RouteDetails => {
    const keyList = Object.keys(data);
    toggleData.preserve_host = data.preserve_host;
    toggleData.strip_path = data.strip_path;
    setToggleData(toggleData);
    for (let i = 0; i < keyList.length; i += 1) {
      const key = keyList[i];
      if (
        data[key as keyof typeof data] === null ||
        data[key as keyof typeof data] === undefined ||
        key === 'headers'
      )
        // eslint-disable-next-line no-param-reassign
        data[key as keyof typeof data] = [];
    }
    return data;
  };

  const handleToggle = (key: string): void => {
    if (key === 'strip_path') toggleData.strip_path = !toggleData.strip_path;
    else toggleData.preserve_host = !toggleData.preserve_host;
    setToggleData(toggleData);
  };

  const handleListChange = (
    key: keyof typeof content,
    value: string[]
  ): void => {
    currentContent[key] = value;
  };

  const postProcess = (request: RouteDetails): RouteDetails => {
    if (
      request.protocols.length !== 0 &&
      request.sources.length === 0 &&
      request.destinations.length === 0
    ) {
      request.sources = null;
      request.destinations = null;
    }
    if (request.headers.length === 0) request.headers = {};
    request.preserve_host = toggleData.preserve_host;
    request.strip_path = toggleData.strip_path;
    return request;
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postService = async (): Promise<any> => {
      setLoading(true);
      const request = postProcess(currentContent);
      await PATCH({
        url: `${BASE_API_URL}/routes/${id}`,
        body: request,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
        .then((response) => {
          if (response.status === 200) {
            setSnack({
              message: 'Successfully modified service',
              severity: 'success',
            });
            setCurrentContent(preProcess(response.data));
          }
          if (response.status === 400) {
            setSnack({
              message: response.data.message || 'Could not able to modify data',
              severity: 'error',
            });
          }
        })
        .catch((err) => {
          setSnack({
            message:
              err.response.data.message || 'Could not able to modify data',
            severity: 'error',
          });
          setCurrentContent(preProcess(request));
        });
      setOpen(true);
      setLoading(false);
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
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <InputLabel sx={{ fontSize: 16, color: '#1ABB9C' }}>
                    {text.key.charAt(0).toUpperCase() +
                      text.key.slice(1).replace('_', ' ')}
                  </InputLabel>
                  {text.type === 'checkbox' && (
                    <div style={{ display: 'block' }}>
                      <ExampleTrackChild
                        yes={currentContent[text.key as keyof typeof content]}
                        onChange={() => handleToggle(text.key)}
                      />
                    </div>
                  )}
                  {text.type === 'list' && (
                    <TagsInput
                      value={currentContent[text.key as keyof typeof content]}
                      onChange={(e) => {
                        handleListChange(text.key as keyof typeof content, e);
                      }}
                    />
                  )}
                  {(text.type === 'number' || text.type === 'text') && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Input
                        sx={{
                          borderRadius: '5px',
                        }}
                        name={text.key}
                        value={currentContent[text.key as keyof typeof content]}
                        disabled={text.key === 'id'}
                        onChange={handleOnChange}
                      />
                    </div>
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

export default RouteEditor;
