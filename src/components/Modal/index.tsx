"use client";

import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface Properties {
  imagesData: any;
  imagesHeader: any;
  handleClose: () => void;
}

const ImageModalComponent = ({
  imagesData,
  imagesHeader,
  handleClose,
}: Properties) => (
  <Modal variant={"brand"} isOpen={true} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Images</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex flexDir={"column"} gap={4}>
          {imagesHeader?.imageFields?.length > 0 ? (
            // @ts-ignore
            imagesHeader?.imageFields?.map((header, index) => {
              return (
                <React.Fragment key={index}>
                  {imagesData[header?.id] && (
                    <Box>
                      <Text as={"h4"} fontWeight={"bold"} mb={2}>
                        {header?.name}
                      </Text>
                      <Image
                        src={imagesData[header?.id]}
                        alt={""}
                        height={400}
                        width={400}
                      />
                    </Box>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>No images found</>
          )}
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ImageModalComponent;
