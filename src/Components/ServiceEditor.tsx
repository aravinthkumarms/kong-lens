/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
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
import { useDispatch, useSelector } from 'react-redux';
import {
  BASE_API_URL,
  API_RESPONSE_SNACK_MESSAGE,
  ACTION_TYPES,
  PROCESS_TYPE,
  SERVICE_DETAILS_INTERFACE,
} from '../Shared/constants';
import { POST, PATCH } from '../Helpers/ApiHelpers';
import { SnackBarAlert } from './Features/SnackBarAlert';
import {
  ServiceDetails,
  ServiceEditorProps,
  snackMessageProp,
} from '../interfaces';
import { updateValue } from '../Reducer/StoreReducer';

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
  let { id } = useParams();

  const navigate = useNavigate();

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const paramValue = query.get('newId') === 'true';

  // to avoid null or undefined inputs in the text fields and send null values for non updated string values
  const processData = (
    data: ServiceDetails,
    processType: string
  ): ServiceDetails => {
    const keyList = Object.keys(data);
    for (let i = 0; i < keyList.length; i += 1) {
      const key = keyList[i];
      if (
        (data[key as keyof ServiceDetails] === null ||
          data[key as keyof ServiceDetails] === undefined ||
          data[key as keyof ServiceDetails] === '') &&
        processType === PROCESS_TYPE.PRE_PROCESS
      ) {
        data = { ...data, [key]: '' };
      } else if (data[key as keyof ServiceDetails] === '')
        data = { ...data, [key]: null };
    }
    return data;
  };

  let serviceData = useSelector(
    (state: { reducer: { serviceData: ServiceDetails } }) =>
      processData(state.reducer.serviceData, PROCESS_TYPE.PRE_PROCESS)
  );

  if (paramValue) serviceData = SERVICE_DETAILS_INTERFACE;

  const [loading, setLoading] = React.useState(false);

  const openSnackBar = useSelector(
    (state: { reducer: { openSnackBar: boolean } }) =>
      state.reducer.openSnackBar
  );

  const snack = useSelector(
    (state: { reducer: { snackBar: snackMessageProp } }) =>
      state.reducer.snackBar
  );

  const dispatch = useDispatch();

  const updateFlagReducer = (type: string, value: boolean): void => {
    dispatch(updateValue({ type, value }));
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

  const handleOnCancel = (): void => {
    dispatch(
      updateValue({ type: ACTION_TYPES.UPDATE_SERVICE_DATA, data: service })
    );
  };

  const handleOnChange = (e: {
    preventDefault: any;
    target: { name: any; type: any; value: any };
  }): void => {
    e.preventDefault;
    const { name, type, value } = e.target;
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_SERVICE_DATA_VALUES,
        key: name,
        value: type === 'number' ? parseInt(value, 10) : value,
      })
    );
  };

  const handleListChange = (
    key: keyof ServiceDetails,
    value: string[]
  ): void => {
    dispatch(
      updateValue({
        type: ACTION_TYPES.UPDATE_SERVICE_DATA_VALUES,
        key,
        value,
      })
    );
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const postService = async (): Promise<any> => {
      if (paramValue) {
        const request = serviceData;
        delete request.id;
        delete request.description;
        if (request.ca_certificates === '') request.ca_certificates = null;
        if (request.client_certificate === '')
          request.client_certificate = null;
        setLoading(true);
        await POST({
          url: `${BASE_API_URL}/services`,
          body: request,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            id = response.data.id;
            if (response.status === 201) {
              navigate(`../services/${id}/?newId=false`, { replace: true });
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.createdNewService,
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
          });
        setLoading(false);
      } else {
        setLoading(true);
        const request: ServiceDetails = processData(
          serviceData,
          PROCESS_TYPE.POST_PROCESS
        );
        await PATCH({
          url: `${BASE_API_URL}/services/${id}`,
          body: request,
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
          .then((response) => {
            if (response.status === 200) {
              updateSnackMessage(
                API_RESPONSE_SNACK_MESSAGE.modifiedExistingService,
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
          });
        setLoading(false);
      }
    };
    postService();
    updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
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
                      value={serviceData[text.key as keyof ServiceDetails]}
                      onChange={(e) => {
                        handleListChange(text.key as keyof ServiceDetails, e);
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
                      value={serviceData[text.key as keyof ServiceDetails]}
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
