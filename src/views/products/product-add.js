import React, { useState, useEffect } from "react";
import { getProduct } from "../../services/product.service";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  CardBody,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  SUPPORTED_FORMATS,
  FILE_SIZE,
  ACCEPTED_MEDIA_TYPES,
} from "../../configs/generalConfig";
import { InputField } from "../../components/form-fields/input-field";
import Toggle from "react-toggle";
import { yupFieldSchema } from "../../helper/formik.helper";
import { saveProduct } from "../../services/product.service";
import { getCategoriesOptions } from "../../services/category.service";
import { getSubcategoriesOptions } from "../../services/subcategory.service";
import { getColorsOptions } from "../../services/color.service";
import { ReactSelectField } from "../../components/form-fields/react-select-field";
import { Link } from "react-router-dom";
import { getImagePath } from "../../helper/general.helper";
import { getOptionsByTable } from "../../services/general-table.service";

const initials = {
  id: "",
  category_id: "",
  subcategory_id: "",
  name: "",
  varient_id: "",
  image: "",
  image_path: "",
  colors: [],
  min_product_stock: 0,
  max_product_stock: 0,
  vehicle_cost: 0,
  road_tax_cost: 0,
  insurance_cost: 0,
  reg_handling_cost: 0,
  min_accessories_cost: 0,
  extra_fitting_cost: 0,
  total_sales_price: 0,
  status: true,
};

const formSchema = Yup.object().shape({
  name: yupFieldSchema("Name", "string", true),
  varient_id: yupFieldSchema("Varient", "string", true),
  category_id: yupFieldSchema("Category", "string", true),
  subcategory_id: yupFieldSchema("Subcategory", "string", true),
  colors: yupFieldSchema("Color", "string", true),
  min_product_stock: yupFieldSchema("Minimum Product stock", "number", true, 0),
  max_product_stock: yupFieldSchema("Maximum Product stock", "number", true, 0),
  vehicle_cost: yupFieldSchema("Vehicle Cost", "number", true, 0),
  road_tax_cost: yupFieldSchema("Road Tax Cost", "number", true, 0),
  insurance_cost: yupFieldSchema("Insurance Cost", "number", true, 0),
  reg_handling_cost: yupFieldSchema(
    "Registration Handeling Cost",
    "number",
    true,
    0
  ),
  min_accessories_cost: yupFieldSchema(
    "Minimum Accessories Cost",
    "number",
    true,
    0
  ),
  extra_fitting_cost: yupFieldSchema("Extra Fitting Cost", "number", true, 0),
  total_sales_price: yupFieldSchema("Total Sales Cost", "number", true, 0),
});

const ProductAdd = ({ match, history }) => {
  const id = match.params.id;
  const [initialValues, setInitialValues] = useState(initials);
  const [categories, setCategories] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [filteredSubCats, setFilteredSubCats] = useState([]);
  const [colors, setColors] = useState([]);
  const [varients, setVarients] = useState([]);
  useEffect(() => {
    if (id) {
      getProductData();
    }
    getOptions();
  }, []);

  useEffect(() => {
    if (id && subCats.length > 0) {
      const tempSubCats = subCats.filter(
        (item) => item.category_id === initialValues.category_id
      );
      setFilteredSubCats(tempSubCats);
    }
  }, [categories, subCats, initialValues]);

  const getOptions = async () => {
    const categoriesRes = await getCategoriesOptions();
    const subCatsRes = await getSubcategoriesOptions();
    const colorsRes = await getOptionsByTable("table/colors");
    const varientsRes = await getOptionsByTable("table/varients");
    setCategories(categoriesRes);
    setSubCats(subCatsRes);
    setColors(colorsRes);
    setVarients(varientsRes);
  };

  const getProductData = async () => {
    const res = await getProduct(id);
    if (res["id"]) {
      const tempInitials = { ...initialValues };
      Object.keys(tempInitials).forEach((fieldName) => {
        tempInitials[fieldName] = res[fieldName];
      });
      if (res["image"]) {
        tempInitials["image_path"] = res["image"];
        tempInitials["image"] = "";
      } else {
        tempInitials["image_path"] = "";
      }
      setInitialValues(tempInitials);
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

  const onChangeCategory = (cat, values, setFieldValue) => {
    if (values.category_id !== cat.id) {
      const tempSubCats = subCats.filter((item) => item.category_id === cat.id);
      setFilteredSubCats(tempSubCats);
      setFieldValue("subcategory_id", "");
    }
  };

  const submitHandler = async (values) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      fData.append(fieldName, values[fieldName]);
    });
    const response = await saveProduct(fData);
    if (response === "success") {
      history.push("/products");
    }
  };
  return (
    <div className={`data-list thumb-view`}>
      <Card>
        <CardHeader>
          <CardTitle>{`${id ? "Edit" : "Add New"} Product`}</CardTitle>
          <Button.Ripple
            color="danger"
            type="button"
            tag={Link}
            to="/products"
            outline
          >
            Back
          </Button.Ripple>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={formSchema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Row>
                  <Col md={6} className="col-md-offset-6">
                    <FormGroup className="text-center">
                      {values.image_path ? (
                        <img
                          className="img-fluid"
                          src={getImagePath(values.image_path)}
                          alt={values.name}
                          height="300"
                          width="300"
                        />
                      ) : (
                        ""
                      )}
                      <div className="d-flex flex-wrap justify-content-between mt-2">
                        <label
                          className="btn btn-primary"
                          htmlFor="update-image"
                          color="primary"
                        >
                          Upload Image
                          <input
                            type="file"
                            name="image"
                            id="update-image"
                            onChange={(e) => setImageField(setFieldValue, e)}
                            accept={ACCEPTED_MEDIA_TYPES}
                            hidden
                          />
                        </label>
                        {values.image_path && values.image_path.length ? (
                          <Button
                            className="btn btn-danger"
                            onClick={() => {
                              setFieldValue("image", "");
                              setFieldValue("image_path", "");
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={6} />
                  <Col md={6}>
                    <InputField
                      label="Product Name"
                      name="name"
                      error={errors.name}
                      touched={touched.name}
                    />
                  </Col>

                  <Col md={6}>
                    <ReactSelectField
                      label="Varient Name"
                      options={varients}
                      name="varient_id"
                      selected={values.varient_id}
                      error={errors.varient_id}
                      touched={touched.varient_id}
                      setFieldValue={setFieldValue}
                      labelKey="name"
                      valueKey="id"
                    />
                  </Col>

                  <Col md={6}>
                    <ReactSelectField
                      label="Category"
                      options={categories}
                      name="category_id"
                      selected={values.category_id}
                      error={errors.category_id}
                      touched={touched.category_id}
                      setFieldValue={setFieldValue}
                      onChangeEvent={(e) =>
                        onChangeCategory(e, values, setFieldValue)
                      }
                      labelKey="name"
                      valueKey="id"
                    />
                  </Col>
                  <Col md={6}>
                    <ReactSelectField
                      label="Subcategory"
                      options={filteredSubCats}
                      name="subcategory_id"
                      selected={values.subcategory_id}
                      error={errors.subcategory_id}
                      touched={touched.subcategory_id}
                      setFieldValue={setFieldValue}
                      labelKey="name"
                      valueKey="id"
                    />
                  </Col>
                  <Col md={6}>
                    <ReactSelectField
                      isMulti
                      label="Color"
                      options={colors}
                      name="colors"
                      selected={values.colors}
                      error={errors.colors}
                      touched={touched.colors}
                      setFieldValue={setFieldValue}
                      labelKey="name"
                      valueKey="id"
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Minimum Product Stock"
                      name="min_product_stock"
                      error={errors.min_product_stock}
                      touched={touched.min_product_stock}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Maximum Product Stock"
                      name="max_product_stock"
                      error={errors.max_product_stock}
                      touched={touched.max_product_stock}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Vehicle Cost"
                      name="vehicle_cost"
                      error={errors.vehicle_cost}
                      touched={touched.vehicle_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Road Tax Cost"
                      name="road_tax_cost"
                      error={errors.road_tax_cost}
                      touched={touched.road_tax_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Insurance Cost"
                      name="insurance_cost"
                      error={errors.insurance_cost}
                      touched={touched.insurance_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Registration Handeling Cost"
                      name="reg_handling_cost"
                      error={errors.reg_handling_cost}
                      touched={touched.reg_handling_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Minimum Accessories Cost"
                      name="min_accessories_cost"
                      error={errors.min_accessories_cost}
                      touched={touched.min_accessories_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Extra Fitting Cost"
                      name="extra_fitting_cost"
                      error={errors.extra_fitting_cost}
                      touched={touched.extra_fitting_cost}
                    />
                  </Col>

                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Total Sales Cost"
                      name="total_sales_price"
                      error={errors.total_sales_price}
                      touched={touched.total_sales_price}
                    />
                  </Col>

                  <Col md={6}>
                    <FormGroup>
                      <Label for="data-icon">Status</Label>
                      <label className="react-toggle-wrapper">
                        <Toggle
                          checked={values.status}
                          icons={false}
                          name="status"
                          onChange={(e) => {
                            console.log(e.target.checked);
                            setFieldValue("status", !values.status);
                          }}
                        />
                      </label>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button.Ripple color="primary" outline type="submit">
                    {id ? "Edit" : "Add"}
                  </Button.Ripple>
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductAdd;
