import { Field, Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { Button, FormGroup, Label } from "reactstrap";
import * as Yup from "yup";
import classnames from "classnames";
import { yupFieldSchema } from "../../../helper/formik.helper";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import Toggle from "react-toggle";
import "../../../assets/scss/pages/data-list.scss";

const GeneralForm = ({
  data,
  show,
  saveRecord,
  handleSidebar,
  getTableData,
  recordType,
}) => {
  const formFields = {
    id: "",
    name: "",
    status: true,
  };
  const [initial, setInitial] = useState({ ...formFields });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const tempInitial = { ...setInitial };
      Object.keys(initial).forEach((field) => {
        tempInitial[field] = data[field];
      });
      setInitial(tempInitial);
    } else {
      setInitial({ ...formFields });
    }
    // eslint-disable-next-line
  }, [data]);

  const formSchema = Yup.object().shape({
    name: yupFieldSchema("name", "string", true),
  });

  const handleSubmit = async (values, { resetForm, resetErrors }) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      fData.append(fieldName, values[fieldName]);
    });
    const res = await saveRecord(fData);
    if (res.status === 200) {
      resetForm({});
      handleSidebar(false);
      getTableData();
    }
  };

  return (
    <Formik
      initialValues={initial}
      enableReinitialize={true}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form>
          <div
            className={classnames("data-list-sidebar", {
              show: show,
            })}
          >
            <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
              <h4>
                {data !== null
                  ? `Update ${recordType}`
                  : `Add New ${recordType}`}
              </h4>
              <X size={20} onClick={() => handleSidebar(false)} />
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
                {errors.name && touched.name ? (
                  <div className="field-error text-danger">{errors.name}</div>
                ) : null}
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
                onClick={() => handleSidebar(false)}
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
export default GeneralForm;
