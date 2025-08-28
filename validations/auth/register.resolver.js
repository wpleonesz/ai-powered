import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  dni: Yup.string().required('Identificación requerida').min(3).max(100),
  firstName: Yup.string().required('Nombre es requerido').min(2).max(100),
  lastName: Yup.string().required('Apellido es requerido').min(2).max(100),
  email: Yup.string().required('Email es requerido').email('Email inválido'),
  mobile: Yup.string(),
  username: Yup.string()
    .required('Nombre de usuario es requerido')
    .min(3)
    .max(20),
  password: Yup.string()
    .required('Contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido'),
});

export const resolver = yupResolver(schema);
