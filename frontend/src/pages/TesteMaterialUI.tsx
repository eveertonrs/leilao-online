// src/pages/TesteMaterialUI.tsx
import { Button, Typography, Container } from '@mui/material';

const TesteMaterialUI = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Teste Material UI
      </Typography>
      <Button variant="contained" color="primary">
        Botão de Teste
      </Button>
    </Container>
  );
};

export default TesteMaterialUI;
