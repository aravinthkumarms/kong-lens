import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';
import * as React from 'react';
import { snackAlertProps } from '../../interfaces';

export function TransitionLeft(props: SlideProps): JSX.Element {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide {...props} direction="right" />;
}

export const SnackBarAlert = ({
  open,
  message,
  severity,
  handleClose,
}: snackAlertProps): JSX.Element => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={TransitionLeft}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
