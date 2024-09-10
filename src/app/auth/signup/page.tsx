"use client";

import FormField from "@/components/FormField";
import { signUpSchema } from "@/validation/schemas/AuthSchema";
import { Box, Flex, Text, Button, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { emailSignup } from "@/app/actions/authAction";
import PasswordField from "@/components/PasswordField";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useDispatch } from "react-redux";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { useRouter } from "next/navigation";

const SignUpComponent = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const initialValues = {
    userName: "",
    email: "",
    password: "",
  };

  const onSubmitForm = async (
    values: any,
    // eslint-disable-next-line no-unused-vars
    setSubmitting: (data: boolean) => void
  ) => {
    const response = await emailSignup(values);
    if (response.success) {
      router.push("/auth/confirm");
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
    setSubmitting(false);
  };

  return (
    <Flex
      maxW={{ base: "100%", md: "max-content" }}
      w="100%"
      alignItems="start"
      justifyContent="center"
      p={{ base: "25px", md: "0px" }}
      flexDirection="column"
    >
      <Box w={"100%"}>
        <Text as={"h1"} fontWeight={"bold"} mb="10px" textAlign={"center"}>
          Sign Up
        </Text>
        <Text mb="3rem" as={"h4"}>
          Enter your email and password to sign Up!
        </Text>
      </Box>
      <Flex
        zIndex="2"
        direction="column"
        w={"100%"}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        mx={{ base: "auto", lg: "unset" }}
        mb={{ base: "20px", md: "auto" }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(form, { setSubmitting }) => {
            onSubmitForm(form, setSubmitting);
          }}
          validationSchema={signUpSchema}
        >
          {({ errors, touched, isSubmitting }: any) => (
            <Form>
              <FormField
                label="User Name*"
                name="userName"
                type="text"
                placeholder="Name"
                disabled={isSubmitting}
                error={errors.userName}
                touched={touched.userName}
                styles={{ marginBottom: "1.5rem" }}
              />
              <FormField
                label="Email address*"
                name="email"
                type="text"
                placeholder="mail@draft.com"
                disabled={isSubmitting}
                error={errors.email}
                touched={touched.email}
                styles={{ marginBottom: "1.5rem" }}
              />
              <PasswordField
                label="Password*"
                name="password"
                placeholder="Min. 8 characters"
                disabled={isSubmitting}
                error={errors.password}
                touched={touched.password}
                styles={{ marginBottom: "1.5rem" }}
              />
              <Button
                type="submit"
                variant="brand"
                w="100%"
                isDisabled={isSubmitting}
              >
                Sign Up {isSubmitting && <Spinner ml={"4"} />}
              </Button>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default SignUpComponent;
