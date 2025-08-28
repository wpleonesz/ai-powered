import { useEffect } from 'react';
import RegisterFormCompact from '@components/user/RegisterFormCompact';

const RegisterFormPage = () => {
  useEffect(() => {
    // Ajustar estilos para evitar problemas de presentación en el iframe
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden'; // Cambio a hidden para evitar scroll
  }, []);

  return <RegisterFormCompact />;
};

export default RegisterFormPage;
