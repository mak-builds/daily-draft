/* eslint-disable no-unused-vars */

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button, Flex, Input } from "@chakra-ui/react";

const QuillEditor = dynamic(() => import("react-quill"), {
  loading: () => <>Loading editor</>,
  ssr: false,
});

interface contentType {
  html: string;
  text: string;
}
interface Properties {
  allowEmpty?: boolean;
  placeHolder?: string;
  handleEditorChange?: (title: string, content: string, text: string) => void;
}

const Editor = ({
  placeHolder = "Text here",
  allowEmpty = true,
  handleEditorChange,
}: Properties) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({ text: "", html: "" });

  const CustomButton = () => {
    const handleClick = () => {
      if (handleEditorChange)
        handleEditorChange(title, content.html, content.text);
    };
    return <span onClick={handleClick}>Submit</span>;
  };

  const quillModules = {
    toolbar: {
      container: "#toolbar",
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "list",
    "bullet",
    "color",
    "link",
  ];

  const handleChange = (newContent: any, _: any, __: any, editor: any) => {
    const processedHtml = newContent
      .replace(/^\s*<p><br><\/p>\s*/i, "") // Remove <p><br></p> at the start of the content
      .trim(); // Remove any leading or trailing whitespace

    const processedText = editor
      .getText()
      .replace(/^\n/, "") // Remove a single newline at the start of the text
      .trim(); // Remove any leading or trailing whitespace

    setContent({ html: processedHtml, text: processedText });
  };

  const handleTitle = (data: any) => setTitle(data.target.value);

  console.log(title, content);

  return (
    <Flex flexDir={"column"} maxH={"calc(100% - 220px)"}>
      <Input onChange={handleTitle} />
      <QuillEditor
        value={content.html}
        onChange={handleChange}
        modules={quillModules}
        formats={quillFormats}
        className="quill-editor"
        placeholder={placeHolder}
      />
      <div id="toolbar">
        <div className="ql-tools">
          <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
          </select>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-link"></button>
          <select className="ql-color"></select>
        </div>
        <div className="ql-custom">
          <Button isDisabled={content.text === "" && allowEmpty}>
            <CustomButton />
          </Button>
        </div>
      </div>
    </Flex>
  );
};

export default Editor;
