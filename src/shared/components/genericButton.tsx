import { Button, ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface GenericButtonProps extends Omit<ButtonProps, 'onClick'> {
  text: string;
  onClick: () => void;
  icon?: ReactNode;
}

export default function GenericButton({ 
  text, 
  onClick, 
  icon,
  ...buttonProps 
}: GenericButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={icon}
      {...buttonProps}
    >
      {text}
    </Button>
  );
}