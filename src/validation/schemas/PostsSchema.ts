import * as yup from "yup";

import * as MESSAGES from "../messages";

const PostsSchema = yup.object().shape({
  title: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
  body_html: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
  body_text: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
  interests: yup.string().required(MESSAGES.REQUIRE_MESSAGE),
  community: yup.string().required(MESSAGES.REQUIRE_MESSAGE),
});

export default PostsSchema;
