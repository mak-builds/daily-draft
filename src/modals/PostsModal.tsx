/* eslint-disable no-unused-vars */
"use client";

import { fetchMasterInterests } from "@/app/actions/communityAction";
import {
  createPost,
  fetchMasterCommunities,
  updatePost,
} from "@/app/actions/PostsAction";
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
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

interface Properties {
  editData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PostsModal = ({ editData, onClose, onSuccess }: Properties) => {
  const [masterInterests, setMasterInterests]: any = useState([]);
  const [masterCommunity, setMasterCommunity]: any = useState([]);

  const initialValues = {
    title: editData?.title || "",
    body_html: editData?.body_html || "",
    body_text: editData?.body_text || "",
    interests: editData?.interestsId || "",
    community: editData?.communityId || "",
  };

  useEffect(() => {
    const fetchData = async () => {
      setMasterInterests((await fetchMasterInterests()).data || []);
      setMasterCommunity((await fetchMasterCommunities()).data || []);
    };
    fetchData();
  }, []);

  const onSubmitForm = async (
    values: any,
    setSubmitting: (data: boolean) => void
  ) => {
    if (editData?.title) {
      await updatePost({ ...values, postId: editData?.id });
      onSuccess();
    } else {
      await createPost(values);
      onSuccess();
    }
    setSubmitting(false);
    // onClose();
  };

  return (
    <Modal variant={"postModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          {editData?.title ? "Edit Post" : "Create Post"}
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
            {({ errors, touched, isSubmitting, setFieldValue }: any) => {
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
                  <FormSelect
                    label="Community*"
                    name="community"
                    disabled={isSubmitting}
                    options={
                      masterCommunity.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      })) || []
                    }
                    placeholder="Select option"
                    error={errors.community}
                    touched={touched.community}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <Editor
                    placeHolder="EDITORRR"
                    defaultContent={{
                      text: editData?.body_text,
                      html: editData?.body_html,
                    }}
                    handleParentChange={(content: string, text: string) => {
                      setFieldValue("body_html", content);
                      setFieldValue("body_text", text);
                    }}
                  />
                  {errors.body_text && (
                    <Text color={"red.500"}>This field is required</Text>
                  )}
                  <Flex justifyContent={"end"} mt={4}>
                    <Button
                      type="submit"
                      variant={"save_button"}
                      isDisabled={isSubmitting}
                    >
                      {editData?.title ? "Update" : "Create"}
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
