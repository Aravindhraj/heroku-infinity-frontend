import React, { useEffect, useState } from "react";
import { Label, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import Toggle from "react-toggle";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { saveSubcategory } from "../../../services/subcategory.service";
import { SUPPORTED_FORMATS, FILE_SIZE } from "../../../configs/generalConfig";

const SubcategoryAdd = ({
  data,
  show,
  options,
  handleSidebar,
  getCategoriesData,
}) => {
  const formFields = {
    id: "",
    category_id: "",
    name: "",
    icon: "",
    status: true,
    image: "",
    image_path: "",
  };
  const [initial, setInitial] = useState({ ...formFields });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const tempInitial = { ...setInitial };
      Object.keys(initial).forEach((field) => {
        tempInitial[field] = data[field];
      });
      // tempInitial["image"] = "";
      if (data["image"]) {
        tempInitial["image_path"] =
          process.env.REACT_APP_API_RESOURCE_URL + data["image"];
      }
      tempInitial["category_id"] = data["category"]["id"];
      setInitial(tempInitial);
    } else {
      setInitial(formFields);
    }
    // eslint-disable-next-line
  }, [data]);

  const formSchema = Yup.object().shape({
    category_id: Yup.string().required("Category field is required."),
    name: Yup.string().required("Name field is required."),
    image: Yup.mixed()
      .notRequired()
      .test("fileType", "Unsupported File Format", (value) =>
        value && value.type ? SUPPORTED_FORMATS.includes(value.type) : true
      )
      .test("fileSize", "File Size is too large", (value) => {
        return value && value.size / 1024 > FILE_SIZE ? false : true;
      }),
  });
  const handleSubmit = async (values, { resetForm }) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      fData.append(fieldName, values[fieldName]);
    });
    const res = await saveSubcategory(fData);
    if (res.status === 200) {
      resetForm({});
      handleSidebar(false);
      getCategoriesData();
    }
  };

  const setImageField = (setFieldValue, e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      if (
        SUPPORTED_FORMATS.includes(file.type) &&
        file.size / 1024 < FILE_SIZE
      ) {
        setFieldValue("image", e.target.files[0]);
        setFieldValue("image_path", URL.createObjectURL(e.target.files[0]));
      }
    }
  };
  return (
    <Formik
      initialValues={initial}
      enableReinitialize={true}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
        handleBlur,
      }) => (
        <Form>
          <div
            className={classnames("data-list-sidebar", {
              show: show,
            })}
          >
            <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
              <h4>
                {data !== null ? "Update Subcategory" : "Add New Subcategory"}
              </h4>
              <X size={20} onClick={() => handleSidebar(false)} />
            </div>
            <PerfectScrollbar
              className="data-list-fields px-2 mt-3"
              options={{ wheelPropagation: false }}
            >
              {values.image_path && values.image_path.length ? (
                <FormGroup className="text-center">
                  <img
                    className="img-fluid"
                    src={values.image_path}
                    alt={values.name}
                  />
                  <div className="d-flex flex-wrap justify-content-between mt-2">
                    <label
                      className="btn btn-flat-primary"
                      htmlFor="update-image"
                      color="primary"
                    >
                      Upload Image
                      <input
                        type="file"
                        name="image"
                        id="update-image"
                        onChange={(e) => setImageField(setFieldValue, e)}
                        hidden
                      />
                    </label>
                    <Button
                      color="flat-danger"
                      onClick={() => {
                        setFieldValue("image", "");
                        setFieldValue("image_path", "");
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                </FormGroup>
              ) : null}
              <FormGroup>
                <Label for="data-name">Category</Label>
                <select
                  name="category_id"
                  id="data-name"
                  className={`form-control ${
                    errors.category_id && touched.category_id && "is-invalid"
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category_id}
                >
                  <option value="">-- select category --</option>
                  {options.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && touched.category_id ? (
                  <div className="field-error text-danger">
                    {errors.category_id}
                  </div>
                ) : null}
              </FormGroup>
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
                <Label for="data-icon">Icon</Label>
                <Field name="icon" id="data-icon" className={`form-control `} />
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
              <label
                className="btn btn-primary"
                htmlFor="upload-image"
                color="primary"
              >
                Upload Image
                <input
                  type="file"
                  id="upload-image"
                  name="image"
                  onChange={(e) => setImageField(setFieldValue, e)}
                  hidden
                />
              </label>
              {errors.image && touched.image ? (
                <div className="field-error text-danger">{errors.image}</div>
              ) : null}
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
export default SubcategoryAdd;
