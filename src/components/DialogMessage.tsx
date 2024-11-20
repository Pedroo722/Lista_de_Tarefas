import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { DialogMessageProps } from '../util/types';

const DialogMessage: React.FC<DialogMessageProps> = ({ open, title, message, onConfirm, onClose, onCancel }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {onCancel && (
          <Button onClick={onCancel} sx={{ color: 'red' }}>
            Cancelar
          </Button>
        )}
        <Button
          onClick={onConfirm || onClose}
          sx={{
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogMessage;