import * as Yup from 'yup';

export const validationSchema = Yup.object({
  username: Yup.string().required(),
  avatar: Yup.object().notRequired(),
});
