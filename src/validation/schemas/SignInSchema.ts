import * as yup from "yup";

import * as MESSAGES from "../messages";

const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required(MESSAGES.REQUIRE_MESSAGE)
    .email(MESSAGES.EMAIL_MESSAGE),
  password: yup.string().required(MESSAGES.REQUIRE_MESSAGE).min(6).max(20),
});

export default signInSchema;
