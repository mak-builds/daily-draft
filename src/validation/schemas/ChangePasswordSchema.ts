import * as yup from "yup";

import * as MESSAGES from "../messages";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, MESSAGES.PASSWORD_MIN_LENGTH)
    .max(20, MESSAGES.PASSWORD_MAX_LENGTH)
    .required(MESSAGES.REQUIRE_MESSAGE),
  newPassword: yup
    .string()
    .min(8, MESSAGES.PASSWORD_MIN_LENGTH)
    .max(20, MESSAGES.PASSWORD_MAX_LENGTH)
    .matches(passwordRegex, MESSAGES.PASSWORD_INVALID_FORMAT)
    .required(MESSAGES.REQUIRE_MESSAGE),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], MESSAGES.PASSWORD_MISMATCH)
    .required(MESSAGES.REQUIRE_MESSAGE),
});

export default ChangePasswordSchema;
