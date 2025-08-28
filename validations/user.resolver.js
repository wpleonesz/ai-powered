import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  dni: Yup.string().required('Identificación requerida').min(3).max(100),
  firstName: Yup.string().required('Nombres requeridos').min(3).max(100),
  lastName: Yup.string().required('Apellidos requerido').min(3).max(100),
  name: Yup.string().required('Nombre completo requerido').min(3).max(100),
  personalEmail: Yup.string()
    .required('Correo personal requerido')
    .email('Correo personal incorrecto'),
  username: Yup.string().required('Usuario requerido').min(3).max(20),
  email: Yup.string()
    .required('Correo Institucional requerido')
    .email('Correo Institucional incorrecto'),
  mobile: Yup.string().required('Número celular requerido'),
  campusId: Yup.number().required('Campus requerido'),
  roles: Yup.array()
    .required('Al menos un rol requerido')
    .min(1, 'Al menos un rol requerido'),
});

export const resolver = yupResolver(schema);
