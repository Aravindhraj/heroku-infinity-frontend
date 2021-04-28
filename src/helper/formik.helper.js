import * as Yup from "yup";

export const setErrorObject = (errors) => {
  const errorObj = {};
  for (let i = 0; i < errors.length; i++) {
    errorObj[`${errors[i]["param"]}`] = errors[i]["msg"];
  }
  return errorObj;
};

export const setNullToEmpty = (val) => {
  if (val === null) return "";
  return val;
};

export const yupFieldSchema = (
  field = "",
  allowedType = "string",
  required,
  min = false,
  max = false
) => {
  let yupObj = getFieldType(Yup, allowedType);

  if (required) {
    yupObj = yupObj.required(field + " field is required.");
  }

  if (min !== false) {
    yupObj = yupObj.min(min, "Minimum value for " + field + " is " + min);
  }

  if (max !== false) {
    yupObj = yupObj.max(min, "Maximum value for " + field + " is " + min);
  }
  return yupObj;
};

export const getFieldType = (yupObj, type) => {
  switch (type) {
    case "string":
    default:
      return yupObj.string();
    case "number":
      return yupObj.number();
    case "mixed":
      return yupObj.mixed();
  }
};
