import React, { useEffect, useState } from "react";
import { Label, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Toggle from "react-toggle";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveDepartment } from "../../../services/department.service";
import { setNullToEmpty, setErrorObject } from "../../../helper/formik.helper";

const schemaObj = Yup.object().shape({
  name: Yup.string().required("Enter Name"),
  status: Yup.boolean(),
});

const DepartmentForm = ({ data, show, handleSidebar, getDepartments }) => {
  const formFields = {
    id: "",
    name: "",
    status: true,
  };
  const [initial, setInitial] = useState({ ...formFields });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const tempInitial = { ...initial };
      Object.keys(initial).forEach((field) => {
        tempInitial[field] = setNullToEmpty(data[field]);
      });
      setInitial(tempInitial);
    } else {
      setInitial(formFields);
    }
    // eslint-disable-next-line
  }, [data]);

  const submitForm = async (data, setErrors, resetForm) => {
    const response = await saveDepartment(data);
    if (response["success"]) {
      handleSidebar(false, resetForm);
      getDepartments();
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  const hideForm = (val, resetForm) => {
    handleSidebar(val);
    resetForm({});
  };

  return (
    <Formik
      initialValues={initial}
      enableReinitialize={true}
      validationSchema={schemaObj}
      onSubmit={(data, { setErrors, resetForm }) =>
        submitForm(data, setErrors, resetForm)
      }
    >
      {({ errors, touched, values, setFieldValue, resetForm }) => (
        <Form>
          <div
            className={classnames("data-list-sidebar", {
              show: show,
            })}
          >
            <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
              <h4>
                {data !== null ? "Update Department" : "Add New Department"}
              </h4>
              <X size={20} onClick={() => hideForm(false, resetForm)} />
            </div>
            <PerfectScrollbar
              className="data-list-fields px-2 mt-3"
              options={{ wheelPropagation: false }}
            >
              <FormGroup>
                <Label for="data-name">Name</Label>
                <Field
                  name="name"
                  id="data-name"
                  className={`form-control ${
                    errors.name && touched.name && "is-invalid"
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="field-error text-danger"
                />
              </FormGroup>
              <FormGroup>
                <Label for="data-icon">Status</Label>
                <label className="react-toggle-wrapper">
                  <Toggle
                    checked={values.status}
                    icons={false}
                    name="status"
                    onChange={() => {
                      setFieldValue("status", !values.status);
                    }}
                  />
                </label>
              </FormGroup>
            </PerfectScrollbar>
            <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
              <Button.Ripple color="primary" type="submit">
                Submit
              </Button.Ripple>
              <Button
                className="ml-1"
                color="danger"
                type="button"
                outline
                onClick={() => hideForm(false, resetForm)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DepartmentForm;
