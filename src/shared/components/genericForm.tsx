import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface GenericFormProps {
  fields: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    rows?: number;
    required?: boolean;            // nuevo
    requiredMessage?: string;      // nuevo
  }[];
  onValidityChange?: (isValid: boolean) => void; // nuevo
  validateOnMount?: boolean;       // opcional
}

export default function GenericForm({ fields, onValidityChange, validateOnMount = false }: GenericFormProps) {
  const [touched, setTouched] = useState<boolean[]>(() => fields.map(() => validateOnMount));

  useEffect(() => {
    // Si cambia la cantidad de campos, resetea touched
    setTouched(fields.map(() => validateOnMount));
  }, [fields.length, validateOnMount]);

  const isEmpty = (v: string) => v.trim().length === 0;
  const isFieldInvalid = (f: GenericFormProps['fields'][number]) =>
    !!f.required && isEmpty(f.value);

  // Reportar validez al padre
  useEffect(() => {
    const valid = fields.every(f => !isFieldInvalid(f));
    onValidityChange?.(valid);
  }, [fields, onValidityChange]);

  return (
    <>
      {fields.map((field, index) => {
        const invalid = isFieldInvalid(field);
        const showError = touched[index] && invalid;
        return (
          <TextField
            key={index}
            label={field.label}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={() =>
              setTouched(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
              })
            }
            fullWidth
            required={field.required}
            error={showError}
            helperText={showError ? (field.requiredMessage ?? 'Campo requerido') : undefined}
            multiline={field.multiline}
            rows={field.rows}
            margin="normal"
          />
        );
      })}
    </>
  );
}