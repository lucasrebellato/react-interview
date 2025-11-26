import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  submitDisabled?: boolean; // nuevo
}

export default function GenericDialog({
  open,
  onClose,
  title,
  onSubmit,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  children,
  submitDisabled = false, // nuevo
}: GenericDialogProps) {
  const handleSubmit = () => {
    if (submitDisabled) return;
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
        <Button onClick={handleSubmit} variant="contained" disabled={submitDisabled}>
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}