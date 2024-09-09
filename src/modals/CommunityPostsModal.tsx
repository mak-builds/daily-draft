/* eslint-disable no-unused-vars */
"use client";

import {
  createCommunity,
  fetchMasterInterests,
  updateCommunity,
} from "@/app/actions/communityAction";
import Editor from "@/components/Editor";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormMenu";
import PostsSchema from "@/validation/schemas/PostsSchema";
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
import { useEffect, useState } from "react";

interface Properties {
  editData: any;
  onClose: () => void;
}

const PostsModal = ({ editData, onClose }: Properties) => {
  const [masterInterests, setMasterInterests]: any = useState([]);

  const initialValues = {
    title: editData?.title || "",
    body: editData?.body || "",
    interests: editData?.interestsId || "",
  };

  useEffect(() => {
    const fetchData = async () => {
      setMasterInterests((await fetchMasterInterests()).data || []);
    };
    fetchData();
  }, []);

  const onSubmitForm = async (
    values: any,
    setSubmitting: (data: boolean) => void
  ) => {
    if (editData?.name) {
      await updateCommunity({ ...values, id: editData?.id });
    } else {
      await createCommunity(values);
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal variant={"postModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          {editData?.name ? "Edit Post" : "Create Post"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(form, { setSubmitting }) => {
              onSubmitForm(form, setSubmitting);
            }}
            validationSchema={PostsSchema}
          >
            {({ errors, touched, isSubmitting }: any) => {
              return (
                <Form style={{ height: "100%", maxHeight: "100%" }}>
                  <FormField
                    label="Post Name*"
                    name="title"
                    type="text"
                    placeholder="Type name here"
                    disabled={isSubmitting}
                    error={errors.title}
                    touched={touched.title}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <FormSelect
                    label="Post Interests*"
                    name="interests"
                    disabled={isSubmitting}
                    options={
                      masterInterests.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      })) || []
                    }
                    placeholder="Select option"
                    error={errors.interests}
                    touched={touched.interests}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <Editor
                    placeHolder="EDITORRR"
                    defaultContent={{ text: "", html: "" }}
                    handleEditorChange={(data) => {}}
                  />
                  <Flex justifyContent={"end"} mt={4}>
                    <Button
                      type="submit"
                      variant={"save_button"}
                      isDisabled={isSubmitting}
                    >
                      {editData?.name ? "Update" : "Create"}
                      {isSubmitting && <Spinner ml={"4"} />}
                    </Button>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostsModal;
