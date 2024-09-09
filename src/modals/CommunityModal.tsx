/* eslint-disable no-unused-vars */
"use client";

import {
  createCommunity,
  fetchMasterInterests,
  updateCommunity,
} from "@/app/actions/communityAction";
import FormArea from "@/components/FormArea";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormMenu";
import CommunitySchema from "@/validation/schemas/communitySchema";
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
  onSuccess: () => void;
  onClose: () => void;
}

const CommunityModal = ({ editData, onSuccess, onClose }: Properties) => {
  const initialValues = {
    name: editData?.name || "",
    description: editData?.description || "",
    interests: editData?.interestsId || "",
  };

  const [masterInterests, setMasterInterests]: any = useState([]);

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
    onSuccess();
  };

  return (
    <Modal variant={"communityModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          {editData?.name ? "Edit community" : "Create community"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(form, { setSubmitting }) => {
              onSubmitForm(form, setSubmitting);
            }}
            validationSchema={CommunitySchema}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form>
                <FormField
                  label="Community Name*"
                  name="name"
                  type="text"
                  placeholder="Type name here"
                  disabled={isSubmitting}
                  error={errors.name}
                  touched={touched.name}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <FormSelect
                  label="Community Interests*"
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
                <FormArea
                  label="Community description*"
                  name="description"
                  placeholder="Type description here"
                  disabled={isSubmitting}
                  error={errors.description}
                  touched={touched.description}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <Flex justifyContent={"end"}>
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
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommunityModal;
