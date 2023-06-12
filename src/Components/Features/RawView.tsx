import React from 'react';
import {
  ModalClose,
  Sheet,
  Typography,
  Modal,
  List,
  ModalOverflow,
} from '@mui/joy';

import { RawViewProps } from '../../interfaces';

export const RawView = ({ json, open, onClose }: RawViewProps): JSX.Element => {
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
            Raw View
          </Typography>
          <List
            sx={{
              overflow: 'scroll',
              mx: 'calc(-1 * var(--ModalDialog-padding))',
              px: 'var(--ModalDialog-padding)',
            }}
          >
            <pre>
              <Typography id="modal-desc" textColor="text.tertiary">
                {JSON.stringify(json, undefined, 2)}
              </Typography>
            </pre>
          </List>
        </Sheet>
      </ModalOverflow>
    </Modal>
  );
};
