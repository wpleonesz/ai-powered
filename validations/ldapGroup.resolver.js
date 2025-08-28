import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  domainId: Yup.string().required('Seleccione un opción'),
});

export const resolver = yupResolver(schema);
