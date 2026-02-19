import * as Yup from "yup";

export const validationSchema = Yup.object({
  startDate: Yup.mixed().nullable().required(),
  stopDate: Yup.mixed().nullable().notRequired(),
});
