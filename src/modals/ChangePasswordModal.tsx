/* eslint-disable no-unused-vars */
"use client";

import FormField from "@/components/FormField";
import ChangePasswordSchema from "@/validation/schemas/ChangePasswordSchema";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

interface Properties {
  onConfirm: () => void;
  onClose: () => void;
}

const ChangePasswordModal = ({ onConfirm, onClose }: Properties) => {
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const onSubmitForm = async (
    values: any,
    setSubmitting: (data: boolean) => void
  ) => {
    setSubmitting(false);
    // onClose();
  };

  return (
    <Modal variant={"changePasswordModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(form, { setSubmitting }) => {
              onSubmitForm(form, setSubmitting);
            }}
            validationSchema={ChangePasswordSchema}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form>
                <FormField
                  label="Old Password*"
                  name="oldPassword"
                  type="password"
                  placeholder="Type name here"
                  disabled={isSubmitting}
                  error={errors.oldPassword}
                  touched={touched.oldPassword}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <FormField
                  label="New Password*"
                  name="newPassword"
                  type="password"
                  placeholder="Type name here"
                  disabled={isSubmitting}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <FormField
                  label="Confirm Password*"
                  name="confirmPassword"
                  type="password"
                  placeholder="Type name here"
                  disabled={isSubmitting}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <Flex justifyContent={"end"}>
                  <Button
                    type="submit"
                    variant={"save_button"}
                    isDisabled={isSubmitting}
                  >
                    Update
                    {isSubmitting && <Spinner ml={"4"} />}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
