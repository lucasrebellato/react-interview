import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { ReactNode } from 'react';

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export default function GenericDialog({
  open,
  onClose,
  title,
  onSubmit,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  children,
}: GenericDialogProps) {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}