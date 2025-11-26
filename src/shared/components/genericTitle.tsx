import { Typography, TypographyProps } from '@mui/material';

interface GenericTitleProps extends Omit<TypographyProps, 'variant'> {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function GenericTitle({ 
  text, 
  variant = 'h4',
  ...typographyProps 
}: GenericTitleProps) {
  return (
    <Typography variant={variant} {...typographyProps}>
      {text}
    </Typography>
  );
}