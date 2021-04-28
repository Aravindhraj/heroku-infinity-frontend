import React from "react";
import Select from "react-select";
import { FormGroup, Label } from "reactstrap";
import { ErrorMessage } from "formik";

export const ReactSelectField = ({
  label,
  name,
  isMulti = false,
  options,
  selected,
  onChangeEvent,
  onBlurEvent,
  setFieldValue,
  valueKey,
  labelKey,
  error,
  touched,
}) => {
  let selectedOption;
  if (isMulti) {
    selectedOption = options.filter((item) =>
      selected.includes(item[valueKey])
    );
  } else {
    selectedOption = options.filter((item) => item[valueKey] === selected)[0];
  }
  return (
    <FormGroup>
      <Label for={`data-${label}`}>{label}</Label>
      <Select
        id={`data-${label}`}
        className={error && touched ? " is-invalid" : ""}
        name={name}
        options={options}
        onChange={(e) => {
          if (isMulti) {
            setFieldValue(name, e ? e.map((item) => item.id) : []);
          } else {
            setFieldValue(name, e.id);
          }
          if (onChangeEvent) onChangeEvent(e);
        }}
        onBlur={(e) => {
          if (onBlurEvent) onBlurEvent(e);
        }}
        value={selectedOption ?? []}
        error={error ?? "invalid"}
        touched={touched ?? "assad"}
        getOptionLabel={(option) => option[labelKey]}
        getOptionValue={(option) => option[valueKey]}
        isMulti={isMulti}
      />
      <ErrorMessage name={name} component="div" className="invalid-feedback" />
    </FormGroup>
  );
};
