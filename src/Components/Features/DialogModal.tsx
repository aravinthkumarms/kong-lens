import React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Dialog } from '@mui/material';
import { DialogModalProps } from '../../interfaces';

const ConfirmDialogModal = ({
  description,
  open,
  onClose,
  onConfirm,
}: DialogModalProps): JSX.Element => (
  <div>
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">CONFIRM</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#12B886' }}>
          No Don&apos;t
        </Button>
        <Button onClick={onConfirm} sx={{ color: '#12B886' }} autoFocus>
          Yes! Delete
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default function DialogModal({
  description,
  open,
  onClose,
  onConfirm,
}: DialogModalProps): JSX.Element {
  return (
    <ConfirmDialogModal
      open={open}
      description={description}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
