"use client";

import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface Properties {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal = ({ onConfirm, onClose }: Properties) => {
  return (
    <Modal variant={"confirmationModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Divider />
          <Text p={4} as={"h4"}>
            Are you sure you want to do this?{" "}
          </Text>
          <Divider />
          <Flex p={4} justifyContent={"end"} gap={4}>
            <Button variant={"default_color"} onClick={onConfirm}>
              Confirm
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
