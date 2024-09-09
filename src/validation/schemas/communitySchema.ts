import * as yup from "yup";

import * as MESSAGES from "../messages";

const CommunitySchema = yup.object().shape({
  name: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
  description: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
  interests: yup.string().required(MESSAGES.REQUIRE_MESSAGE),
});

export default CommunitySchema;
