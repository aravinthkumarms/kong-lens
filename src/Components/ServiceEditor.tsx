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
  const processData = (data: ServiceDetails, type: string): ServiceDetails => {
    const keyList = Object.keys(data);
    for (let i = 0; i < keyList.length; i += 1) {
      const key = keyList[i];
      if (
        (data[key as keyof typeof data] === null ||
          data[key as keyof typeof data] === undefined ||
          data[key as keyof typeof data] === '') &&
        type === 'preprocess'
      ) {
        // eslint-disable-next-line no-param-reassign
        data[key as keyof typeof data] = '';
      } else if (data[key as keyof typeof data] === '')
        // eslint-disable-next-line no-param-reassign
        data[key as keyof typeof data] = null;
    }
    return data;
  };

  const [currentService, setCurrentService] = React.useState<ServiceDetails>(
    processData(service, 'preprocess')
  );

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

  let { id } = useParams();

  const navigate = useNavigate();

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const paramValue = query.get('newId');

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
        const request = currentService;
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
            request.ca_certificates = '';
            request.id = '';
            request.client_certificate = '';
          });
        setLoading(false);
      } else {
        setLoading(true);
        const request: ServiceDetails = processData(
          currentService,
          'postProcess'
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
              setCurrentService(processData(response.data, 'preprocess'));
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
    updateFlagReducer(ACTION_TYPES.OPEN_SNACK_BAR, true);
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
