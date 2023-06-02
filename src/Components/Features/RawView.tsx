import React, { useState } from 'react';
import { ModalDialog, ModalClose, ModalDialogProps } from '@mui/joy';
import { Modal, Typography } from '@mui/material';
import { BASE_API_URL } from '../../Shared/constants';
import { GET } from '../../Helpers/ApiHelpers';
import { RawViewProps, snackMessageProp } from '../../interfaces';
import { SnackBarAlert } from './SnackBarAlert';

export const RawView = ({
  id,
  open,
  onClose,
  useCase,
}: RawViewProps): JSX.Element => {
  const [rawData, setRawData] = useState();
  const [layout, setLayout] = React.useState<
    ModalDialogProps['layout'] | undefined
  >(undefined);
  const [snack, setSnack] = React.useState<snackMessageProp>({
    message: '',
    severity: 'success',
  });
  const [snackOpen, setSnackOpen] = useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getServices = async () => {
      await GET({
        url: `${BASE_API_URL}/${useCase}/${id}`,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
        .then((response) => {
          if (response.status === 200) {
            // eslint-disable-next-line prefer-destructuring
            setRawData(response.data);
          }
          setSnack({
            message: 'Successfully fetched raw data',
            severity: 'success',
          });
        })
        .catch((err) => {
          setSnack({
            message:
              err.response.data.message ||
              'Unable to fetch records, Please try again!',
            severity: 'error',
          });
        });
      setSnackOpen(true);
    };
    getServices();
  }, [id, useCase]);
  return (
    <>
      <SnackBarAlert
        open={snackOpen}
        message={snack.message}
        severity={snack.severity}
        handleClose={() => {
          setSnackOpen(false);
        }}
      />
      <Modal
        open={open}
        onClose={() => {
          onClose();
          setLayout(undefined);
        }}
      >
        <ModalDialog
          aria-labelledby="layout-modal-title"
          aria-describedby="layout-modal-description"
          sx={{
            border: 'solid 2px #1AAA9C',
          }}
          layout={layout}
        >
          <ModalClose />
          <Typography sx={{ fontWeight: 'bold' }}>Raw View</Typography>
          <pre>
            <Typography id="layout-modal-description">
              {JSON.stringify(rawData, undefined, 2)}
            </Typography>
          </pre>
        </ModalDialog>
      </Modal>
    </>
  );
};
