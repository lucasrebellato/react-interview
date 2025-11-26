import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GenericTitle from '../shared/components/genericTitle';
import GenericButton from '../shared/components/genericButton';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <GenericTitle text="404 - No encontrado" sx={{ mb: 1 }} />
      <GenericTitle text="El recurso solicitado no existe." variant="h6" sx={{ mb: 3 }} />
      <GenericButton text="Volver al inicio" onClick={() => navigate('/')} />
    </Container>
  );
}