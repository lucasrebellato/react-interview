import { TextField } from '@mui/material';

interface GenericFormProps {
  fields: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    rows?: number;
  }[];
}

export default function GenericForm({ fields }: GenericFormProps) {
  return (
    <>
      {fields.map((field, index) => (
        <TextField
          key={index}
          label={field.label}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          fullWidth
          multiline={field.multiline}
          rows={field.rows}
          margin="normal"
        />
      ))}
    </>
  );
}