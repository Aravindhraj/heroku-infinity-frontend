import React from "react";
import { FormGroup, Label } from "reactstrap";
import { Field } from "formik";

export const InputField = ({
  label,
  name,
  type = "text",
  className = "",
  error = "",
  touched = false,
}) => (
  <FormGroup>
    <Label for={`data-${name}`}>{label}</Label>
    <Field
      type={type}
      name={name}
      id={`data-${name}`}
      className={`form-control ${className} ${
        error && touched && "is-invalid"
      }`}
    />
    {error && touched ? (
      <div className="field-error text-danger">{error}</div>
    ) : null}
  </FormGroup>
);
