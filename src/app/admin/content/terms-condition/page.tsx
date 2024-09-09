"use client";

import { fetchTermsCondition } from "@/app/actions/PolicyAction";
import Editor from "@/components/Editor";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const TermsAndConditionPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const [editorContent, setEditorContent] = useState({ html: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      const termsConditionResponse: any = await fetchTermsCondition();
      if (termsConditionResponse.success) {
        setEditorContent({
          text: termsConditionResponse.data[0]?.terms_and_conditions,
          html: termsConditionResponse.data[0]?.terms_and_conditions_html,
        });
      }
    };
    fetchData();
  }, []);

  const handleEditorChange = async (html: string, text: string) => {
    const doesTermsConditionExists: any = await fetchTermsCondition();
    // Working ...
    const payload = { id: doesTermsConditionExists.data?.id, html, text };
    if (doesTermsConditionExists.data.length === 0) {
      const updateTC = await fetch(`/api/termscondition`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const tcResponse = await updateTC.json();

      if (!tcResponse.error) {
        dispatch(
          showToastWithTimeout({
            message: "Updated Successfully",
            status: "success",
          })
        );
      }
    } else {
      const updateTC = await fetch(`/api/termscondition`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const tcResponse = await updateTC.json();
      if (!tcResponse.error) {
        dispatch(
          showToastWithTimeout({
            message: "Updated Successfully",
            status: "success",
          })
        );
      }
    }
  };

  return (
    <Editor
      placeHolder="T&C"
      defaultContent={editorContent}
      handleEditorChange={handleEditorChange}
    />
  );
};

export default TermsAndConditionPage;
