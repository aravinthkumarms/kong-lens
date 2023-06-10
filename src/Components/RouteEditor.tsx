/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  styled,
  InputLabel,
} from '@mui/material';

import { useParams } from 'react-router-dom';
import { Input, Select, Switch, Typography, Option } from '@mui/joy';
import { TagsInput } from 'react-tag-input-component';
import { useDispatch, useSelector } from 'react-redux';
import {
  ACTION_TYPES,
  API_RESPONSE_SNACK_MESSAGE,
  BASE_API_URL,
  ROUTE_DETAILS_INTERFACE,
  PROCESS_TYPE,
} from '../Shared/constants';
import { PATCH, POST } from '../Helpers/ApiHelpers';
import { SnackBarAlert } from './Features/SnackBarAlert';
import {
  EditorProps,
  RouteDetails,
  snackMessageProp,
  toggleProps,
} from '../interfaces';
import { updateValue } from '../Reducer/StoreReducer';

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

const RouteEditor = ({
  content,
  textFields,
  param,
}: EditorProps): JSX.Element => {
  let routeData = useSelector(
    (state: { reducer: { routeData: RouteDetails } }) => state.reducer.routeData
  );
  if (param) routeData = ROUTE_DETAILS_INTERFACE;

  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const openSnackBar = useSelector(
    (state: { reducer: { openSnackBar: boolean } }) =>
      state.reducer.openSnackBar
  );

  const snack = useSelector(
    (state: { reducer: { snackBar: snackMessageProp } }) =>
      state.reducer.snackBar
  );

  const { id } = useParams();

  const updateFlagReducer = (type: string, value: boolean): void => {
    dispatch(updateValue({ type, value }));
  };

  const handleOnChange = (e: {
    preventDefault: any;
    target: { name: any; type: any; value: any };
  }): void => {
    e.preventDefault;
    const { name, type, value } = e.target;
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES,
        key: name,
        value: type === 'number' ? parseInt(value, 10) : value,
      })
    );
  };

  const processData = (
    data: RouteDetails,
    processType: string
  ): RouteDetails => {
    if (processType === PROCESS_TYPE.PRE_PROCESS) {
      const keyList = Object.keys(data);
      for (let i = 0; i < keyList.length; i += 1) {
        const key = keyList[i];
        if (
          data[key as keyof typeof data] === null ||
          data[key as keyof typeof data] === undefined
        )
          data = { ...data, [key]: '' };
      }
      if (Object.keys(data.headers).length === 0) {
        data = { ...data, headers: [] };
      } else if (data.headers) {
        const headers = [];
        const keys = Object.keys(data.headers);
        for (let j = 0; j < keys.length; j += 1) {
          headers.push(keys[j].concat(`:${data.headers[keys[j]]}`));
        }
        data = { ...data, headers };
      }
    } else {
      if (
        data.protocols.length !== 0 &&
        data.sources.length === 0 &&
        data.destinations.length === 0
      ) {
        data = { ...data, sources: null, destinations: null };
      }
      if (data.headers.length === 0) data.headers = {};
      else {
        const header = data.headers;
        const res: any = {};
        for (let i = 0; i < header.length; i += 1) {
          const current = header[i].split(':');
          res[current[0]] = current[1].split(',');
        }
        data = { ...data, headers: res };
      }
      delete data.service_name;
    }
    return data;
  };

  const handleOnCancel = (): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_ROUTE_DATA,
        data: processData(content, PROCESS_TYPE.PRE_PROCESS),
      })
    );
  };

  const handleToggle = (key: string): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES,
        key,
        value:
          key === 'strip_path'
            ? !routeData.strip_path
            : !routeData.preserve_host,
      })
    );
  };

  const handleListChange = (
    key: keyof typeof content,
    value: string[]
  ): void => {
    dispatch(
      updateValue({ type: ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES, key, value })
    );
  };

  const handlePathHandling = (): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_ROUTE_DATA_VALUES,
        key: 'path_handling',
        value: routeData.path_handling === 'v1' ? 'v0' : 'v1',
      })
    );
  };

  const updateSnackMessage = (message: string, severity: string): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.SET_SNACK_BAR_MESSAGE,
        message,
        severity,
      })
    );
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postService = async (): Promise<any> => {
      const request: RouteDetails = processData(
        routeData,
        PROCESS_TYPE.POST_PROCESS
      );
      if (!param) {
        setLoading(true);
        await PATCH({
          url: `${BASE_API_URL}/routes/${id}`,
          body: request,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 200) {
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.modifiedExistingRoute,
                'success'
              );
            }
          })
          .catch((err) => {
            updateSnackMessage(
              err.response
                ? err.response.data.message
                : API_RESPONSE_SNACK_MESSAGE.unableToSaveData,
              'error'
            );
            dispatch(
              updateValue({
                type: ACTION_TYPES.UPDATE_ROUTE_DATA,
                data: processData(request, PROCESS_TYPE.PRE_PROCESS),
              })
            );
          });
        updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
        setLoading(false);
      } else {
        request.service = {
          id,
        };
        setLoading(true);
        await POST({
          url: `${BASE_API_URL}/routes`,
          body: request,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 201) {
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.createdNewRoute,
                'success'
              );
              updateFlagReducer(ACTION_TYPES.OPEN_ROUTE_MODAL, false);
              updateFlagReducer(ACTION_TYPES.REFRESH_ROUTE_TABLE, true);
            }
          })
          .catch((err) => {
            dispatch(
              updateValue({
                type: ACTION_TYPES.UPDATE_ROUTE_DATA,
                data: processData(routeData, PROCESS_TYPE.PRE_PROCESS),
              })
            );
            updateSnackMessage(
              err.response
                ? err.response.data.message
                : API_RESPONSE_SNACK_MESSAGE.unableToSaveData,
              'error'
            );
          });
        updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
        setLoading(false);
      }
    };
    postService();
  };

  return (
    <>
      <SnackBarAlert
        open={openSnackBar}
        message={snack.message}
        severity={snack.severity}
        handleClose={() => {
          updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, false);
        }}
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
                        yes={routeData[text.key as keyof typeof content]}
                        onChange={() => handleToggle(text.key)}
                      />
                    </div>
                  )}
                  {text.type === 'list' && (
                    <TagsInput
                      value={routeData[text.key as keyof typeof content]}
                      onChange={(e) => {
                        handleListChange(text.key as keyof typeof content, e);
                      }}
                    />
                  )}
                  {text.type === 'dropdown' && (
                    <Select
                      defaultValue={routeData[text.key as keyof typeof content]}
                      value={routeData[text.key as keyof typeof content]}
                      onChange={handlePathHandling}
                    >
                      <Option value="v1">v1</Option>
                      <Option value="v0">v0</Option>
                    </Select>
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
                        value={routeData[text.key as keyof typeof content]}
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
