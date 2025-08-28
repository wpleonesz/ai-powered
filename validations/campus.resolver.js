import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('nombre requerido').min(4).max(100),
  institutionId: Yup.number().required('Institución requerida'),
  code_ext_mrt: Yup.string()
    .required('Codigo de Matriz/Extensión requerido')
    .min(2),
});

export const resolver = yupResolver(schema);
