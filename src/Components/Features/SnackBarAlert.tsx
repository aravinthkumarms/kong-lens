import { Alert, AlertColor, Slide, SlideProps, Snackbar } from '@mui/material';
import * as React from 'react';

export function TransitionLeft(props: SlideProps): JSX.Element {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide {...props} direction="right" />;
}

export type snackProps = {
  open: boolean;
  message: string;
  severity: AlertColor;
  handleClose: VoidFunction;
};

export const SnackBarAlert = ({
  open,
  message,
  severity,
  handleClose,
}: snackProps): JSX.Element => {
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
