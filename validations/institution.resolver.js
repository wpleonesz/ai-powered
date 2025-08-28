import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido').min(4).max(100),
  logo: Yup.string().required('Requiere Logo'),
  isologo: Yup.string().required('Requiere IsoLogo'),
  code_ies: Yup.string().required('Código IES requerido').min(3),
});

export const resolver = yupResolver(schema);
