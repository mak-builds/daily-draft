/* eslint-disable no-unused-vars */
import { Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

interface Properties {
  handleSubmit: (emails: string[]) => void;
}

const MultiEmailInput = ({ handleSubmit }: Properties) => {
  const [emails, setEmails] = useState<string[]>([]);

  const handleOnchange = (newEmails: string[]) => {
    setEmails(newEmails);
  };

  const handleSubmitButton = () => {
    handleSubmit(emails);
  };

  return (
    <div>
      <ReactMultiEmail
        placeholder="Input your email and press enter"
        emails={emails}
        onChange={handleOnchange}
        getLabel={(
          email: string,
          index: number,
          removeEmail: (index: number) => void
        ) => (
          <div data-tag key={index}>
            {email}
            <span data-tag-handle onClick={() => removeEmail(index)}>
              ×
            </span>
          </div>
        )}
      />
      <Flex justifyContent={"end"}>
        <Button
          isDisabled={emails.length < 1}
          mt={8}
          variant={"brand"}
          onClick={handleSubmitButton}
        >
          Invite
        </Button>
      </Flex>
    </div>
  );
};

export default MultiEmailInput;
