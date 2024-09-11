"use client";

import { createDraft } from "@/app/actions/DraftAction";
import Editor from "@/components/Editor";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useDispatch } from "react-redux";

const DailyDraft = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleEditorChange = async (
    title: string,
    html: string,
    text: string
  ) => {
    console.log(title, html, text);
    const response = await createDraft({ title, html, text });
    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Created Successfully",
          status: "success",
        })
      );
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
  };

  return <Editor placeHolder="T&C" handleEditorChange={handleEditorChange} />;
};

export default DailyDraft;
