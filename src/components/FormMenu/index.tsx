/* eslint-disable no-unused-vars */
import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field } from "formik";

interface Option {
  value: string;
  label: string;
}

interface Properties {
  label: string;
  name: string;
  placeholder?: string;
  options: Option[];
  error?: string;
  touched?: boolean;
  onFocus?: (event: any) => void;
  labelStyles?: any;
  inputStyles?: any;
  styles?: any;
  disabled?: boolean;
  variant?: string;
}

const FormSelect = ({
  label,
  name,
  placeholder = "Select option",
  options,
  error,
  touched,
  onFocus,
  labelStyles,
  inputStyles,
  styles,
  disabled,
  variant = "default",
}: Properties) => {
  return (
    <FormControl isInvalid={!!error && touched} style={styles}>
      <FormLabel style={labelStyles} htmlFor={name}>
        {label}
      </FormLabel>
      <Field
        variant={variant}
        as={Select}
        id={name}
        name={name}
        placeholder={placeholder}
        onFocus={onFocus}
        style={inputStyles}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormSelect;
