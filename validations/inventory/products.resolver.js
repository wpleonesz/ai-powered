import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido').min(3).max(100),
  description: Yup.string().required('Descripción requerida').min(3).max(500),
  sku: Yup.string().required('SKU requerido').min(3).max(100),
  price: Yup.number().required('Precio requerido').min(0),
  stock: Yup.number().required('Stock requerido').min(0),
});

export const resolver = yupResolver(schema);
