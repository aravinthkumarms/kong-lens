import React from 'react';
import { ModalClose, Sheet, Typography, Modal, ModalOverflow } from '@mui/joy';

import { useDispatch } from 'react-redux';
import { CreateRouteProps } from '../../interfaces';
import RouteEditor from '../RouteEditor';
import { RouteDetailsInterface, RouteTextFields } from '../../Shared/constants';
import { updateValue } from '../../Reducer/StoreReducer';

export const CreateRoute = ({
  open,
  onClose,
}: CreateRouteProps): JSX.Element => {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ModalOverflow sx={{ maxWidth: '800px', margin: 'auto' }}>
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 'auto',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            border: '3px solid #1ABB9C',
            overflowY: 'scroll',
          }}
        >
          <ModalClose />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Add Route
          </Typography>
          <RouteEditor
            content={RouteDetailsInterface}
            textFields={RouteTextFields}
            param
          />
        </Sheet>
      </ModalOverflow>
    </Modal>
  );
};
