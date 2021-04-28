import React, { useEffect, useState } from "react";
import { Label, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Toggle from "react-toggle";
import { Formik, Field, Form } from "formik";
import { saveAccessories } from "../../../services/accessories.service";
import * as Yup from "yup";

const AccessoriesForm = ({ data, show, handleSidebar, getAccessoriesData }) => {
  const formFields = {
    id: "",
    name: "",
    price: "",
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
    name: Yup.string().required("Name field is required."),
    price: Yup.string().required("Price field is required."),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      fData.append(fieldName, values[fieldName]);
    });
    const res = await saveAccessories(fData);
    if (res.status === 200) {
      handleSidebar(false);
      resetForm({});
      getAccessoriesData();
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
                {data !== null ? "Update Accessory" : "Add New Accessory"}
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
                <Label for="data-icon">Price</Label>
                <Field
                  type="number"
                  name="price"
                  id="data-price"
                  className={`form-control ${
                    errors.price && touched.price && "is-invalid"
                  }`}
                />
                {errors.price && touched.price ? (
                  <div className="field-error text-danger">{errors.price}</div>
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

export default AccessoriesForm;
