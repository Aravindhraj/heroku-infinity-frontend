import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Label,
  Media,
  Row,
  Table,
} from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getActiveCategories } from "../../services/lead-catetgories.service";
import { getActiveTypes } from "../../services/lead-types.service";
import { getCategoriesOptions } from "../../services/category.service";
import { getSubcategoriesOptions } from "../../services/subcategory.service";
import { getEnquiryDetails } from "../../services/enquiry.service";
import qs from "qs";
import * as Yup from "yup";
import { ReactSelectField } from "../../components/form-fields/react-select-field";
import { fetchActiveProducts } from "../../services/product.service";
import { getActiveFinance } from "../../services/finance.service";
import { getActivePaymentTypes } from "../../services/payment-type.service";
import { fetchSalesPerson } from "../../services/users.service";
import Select from "react-select";
import { getLead, saveLead } from "../../services/sales-lead.service";
import { setErrorObject } from "../../helper/formik.helper";
import { getImagePath } from "../../helper/general.helper";
import "./style.scss";
import "../../assets/scss/pages/invoice.scss";
import { getAccessoriesOptions } from "../../services/accessories.service";
import logo from "../../assets/img/logo/logo.png";
import { Mail, Phone } from "react-feather";

const schemaObj = Yup.object().shape({
  enquiry_id: Yup.string().nullable(),
  lead_type: Yup.string().required("Select Lead Type"),
  lead_category: Yup.string().required("Select Lead Category"),
  firstname: Yup.string().required("Enter Firstname"),
  lastname: Yup.string().required("Enter Lastname"),
  email: Yup.string().email("Enter Valid Email").required("Enter Email"),
  age: Yup.string().required("Enter Age"),
  contact: Yup.string().required("Enter Contact"),
  alternate_contact: Yup.string().nullable(),
  address: Yup.string().required("Enter Address"),
  location: Yup.string().nullable(),
  city: Yup.string().required("Enter City"),
  pincode: Yup.string().required("Enter Pincode"),
  product_category: Yup.number().required("Select Product Category"),
  product_subcategory: Yup.number().required("Select Product Sub-Category"),
  product: Yup.number().required("Select Product"),
  product_user: Yup.string().nullable(),
  finance_type: Yup.object().nullable(),
  payment_type: Yup.object().required("Select Payment Type"),
  advance_payment: Yup.number()
    .required("Enter Advance Payment")
    .min(0, "Enter atleast 0 or more"),
  buying_date: Yup.object().required("Select Buying Date"),
  priority: Yup.object().required("Select Priority"),
  sales_executive: Yup.object().required("Select Sales Executive"),
  delivery_date: Yup.date().min(
    new Date(Date.now() - 86400000),
    "Select Today's Date or Future Date"
  ),
  document: Yup.object().nullable(),
  document_path: Yup.string().nullable(),
  accessories: Yup.string().nullable(),
});

const initialValues = {
  id: "",
  enquiry_id: "",
  lead_type: "",
  lead_category: "",
  firstname: "",
  lastname: "",
  age: "",
  email: "",
  contact: "",
  alternate_contact: "",
  address: "",
  location: "",
  city: "",
  pincode: "",
  product_category: "",
  product_subcategory: "",
  product: "",
  product_user: "",
  finance_type: "",
  payment_type: "",
  advance_payment: 0,
  buying_date: "",
  priority: "",
  sales_executive: "",
  delivery_date: new Date().toISOString().substr(0, 10),
  document: "",
  document_path: "",
  accessories: "",
};

const AddSalesLead = ({ match, history }) => {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const formRef = useRef();
  const [lead, setLead] = useState(initialValues);
  const [action, setAction] = useState("add");
  const [lead_types, setLeadTypes] = useState([]);
  const [lead_categories, setLeadCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCats] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredSubCats, setFilteredSubCats] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [finance_types, setFinanceTypes] = useState([]);
  const [payment_types, setPaymentTypes] = useState([]);
  const [sales_executives, setSalesExecutives] = useState([]);
  const [allAccessories, setAccessories] = useState([]);
  const [selected_product, setSelectedProduct] = useState(null);
  const [selected_accessories, setSelectedAccessories] = useState([]);
  const [form_values, setFormValues] = useState(null);
  const SUPPORTED_FORMATS = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
  ];
  const ACCEPTED_MEDIA_TYPES = "image/png,image/jpg,image/jpeg,application/pdf";
  const FILE_SIZE = 4000;

  const buying_date_option = [
    { name: "Ready to buy" },
    { name: "One week" },
    { name: "2 week" },
    { name: "3 week" },
    { name: "Month later" },
    { name: "Not Sure" },
  ];

  const priority_types = [
    { name: "Urgent" },
    { name: "High" },
    { name: "Low" },
  ];

  useEffect(() => {
    fetchEnquiryDetails();
    fetchActiveCategories();
    fetchActiveTypes();
    fetchCategoriesAndSubCategories();
    fetchProducts();
    fetchFinanceTypes();
    fetchPaymentTypes();
    fetchActiveAccessories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (match.params.id) {
      async function getSalesLeadData() {
        const temp_lead_data = await getLead(match.params.id);
        console.log(temp_lead_data);
        if (temp_lead_data) {
          if (temp_lead_data["delivery_date"]) {
            const temp_date = new Date(temp_lead_data["delivery_date"]);
            let month = temp_date.getMonth();
            month = parseInt(month) + 1;
            if (month < 10) {
              month = "0" + month;
            }
            temp_lead_data["delivery_date"] =
              temp_date.getFullYear() + "-" + month + "-" + temp_date.getDate();
          }
          if (temp_lead_data["accessories"]) {
            setSelectedAccessories(temp_lead_data["accessories"]);
          }
          if (temp_lead_data["sales_user"]) {
            temp_lead_data["sales_user"]["fullname"] =
              temp_lead_data["sales_user"]["firstname"] +
              " " +
              temp_lead_data["sales_user"]["lastname"];
            temp_lead_data["sales_executive"] = temp_lead_data["sales_user"];
          }
          if (temp_lead_data["lead_type_data"]) {
            temp_lead_data["lead_type"] = temp_lead_data["lead_type_data"];
          }
          if (temp_lead_data["lead_category_data"]) {
            temp_lead_data["lead_category"] =
              temp_lead_data["lead_category_data"];
          }
          if (temp_lead_data["payment_type_data"]) {
            temp_lead_data["payment_type"] =
              temp_lead_data["payment_type_data"];
          }
          if (temp_lead_data["finance_type_data"]) {
            temp_lead_data["finance_type"] =
              temp_lead_data["finance_type_data"];
          }
          if (temp_lead_data["buying_date"]) {
            temp_lead_data["buying_date"] = {
              name: temp_lead_data["buying_date"],
            };
          }
          if (temp_lead_data["priority"]) {
            temp_lead_data["priority"] = { name: temp_lead_data["priority"] };
          }
          if (temp_lead_data["document"]) {
            temp_lead_data["document_path"] = temp_lead_data["document"];
            temp_lead_data["document"] = "";
          } else {
            temp_lead_data["document_path"] = "";
          }
          setLead(temp_lead_data);
          setAction("edit");
          setTimeout(() => {
            if (formRef && formRef["current"] && formRef.current["values"]) {
              setFormValues(formRef.current.values);
            }
          });
        } else {
          history.push("../sales");
        }
      }
      getSalesLeadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  useEffect(() => {
    if (subcategories.length > 0) {
      const tempSubCats = subcategories.filter(
        (item) => item.category_id === lead.product_category
      );
      setFilteredSubCats(tempSubCats);
    }
    if (products.length > 0) {
      const tempProducts = products.filter(
        (product) =>
          product.category_id === lead.product_category &&
          product.subcategory_id === lead.product_subcategory
      );
      setFilteredProducts(tempProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, subcategories, initialValues]);

  useEffect(() => {
    async function fetchSalesPersonData() {
      const sales_persons = await fetchSalesPerson();
      if (sales_persons) {
        requestAnimationFrame(() => {
          sales_persons.forEach((val, key) => {
            sales_persons[key]["fullname"] =
              val["firstname"] + " " + val["lastname"];
          });
          setSalesExecutives(sales_persons);
        });
      }
    }
    fetchSalesPersonData();
  }, []);

  const fetchProducts = async () => {
    const products_data = await fetchActiveProducts();
    setProducts(products_data);
  };

  const fetchEnquiryDetails = async () => {
    const query_params = qs.parse(history.location.search, {
      ignoreQueryPrefix: true,
    });
    if (query_params["cts"] && !match.params.id) {
      const enquiry = await getEnquiryDetails(query_params["cts"]);
      if (enquiry) {
        const temp_lead = { ...lead };
        temp_lead["enquiry_id"] = enquiry["id"];
        temp_lead["firstname"] = enquiry["firstname"];
        temp_lead["lastname"] = enquiry["lastname"];
        temp_lead["email"] = enquiry["email"];
        temp_lead["contact"] = enquiry["phone"];
        temp_lead["pincode"] = enquiry["pincode"];
        temp_lead["city"] = enquiry["city"];
        if (enquiry["sales"] && enquiry["sales"]["firstname"]) {
          enquiry["sales"]["fullname"] =
            enquiry["sales"]["firstname"] + " " + enquiry["sales"]["lastname"];
          temp_lead["sales_executive"] = enquiry["sales"];
        }
        if (enquiry["product"] && enquiry["product"]["id"]) {
          temp_lead["product"] = enquiry["product"]["id"];
          if (
            enquiry["product"]["category"] &&
            enquiry["product"]["category"]["id"]
          ) {
            temp_lead["product_category"] =
              enquiry["product"]["category"]["id"];
          }
          if (
            enquiry["product"]["sub_category"] &&
            enquiry["product"]["sub_category"]["id"]
          ) {
            temp_lead["product_subcategory"] =
              enquiry["product"]["sub_category"]["id"];
          }
        }
        setLead(temp_lead);
      }
    }
  };

  const fetchActiveAccessories = async () => {
    const temp_accessories = await getAccessoriesOptions();
    if (temp_accessories) setAccessories(temp_accessories);
  };

  const fetchActiveCategories = async () => {
    const temp_categories = await getActiveCategories();
    if (temp_categories) setLeadCategories(temp_categories);
  };

  const fetchFinanceTypes = async () => {
    const temp_finance_types = await getActiveFinance();
    if (temp_finance_types) setFinanceTypes(temp_finance_types);
  };

  const fetchPaymentTypes = async () => {
    const temp_payment_types = await getActivePaymentTypes();
    if (temp_payment_types) setPaymentTypes(temp_payment_types);
  };

  const fetchActiveTypes = async () => {
    const temp_types = await getActiveTypes();
    if (temp_types) setLeadTypes(temp_types);
  };

  const fetchCategoriesAndSubCategories = async () => {
    const categoriesRes = await getCategoriesOptions();
    const subCatsRes = await getSubcategoriesOptions();
    setCategories(categoriesRes);
    setSubCats(subCatsRes);
  };

  const onChangeCategory = (cat, values, setFieldValue) => {
    if (values.product_category !== cat.id) {
      const tempSubCats = subcategories.filter(
        (item) => item.category_id === cat.id
      );
      setFilteredSubCats(tempSubCats);
      setFilteredProducts([]);
      setFieldValue("product_subcategory", "");
      setFieldValue("product", "");
      setFieldValue("accessories", "");
      setSelectedProduct(null);
      setSelectedAccessories([]);
    }
  };
  const onChangeSubCategory = (cat, values, setFieldValue) => {
    if (values.product_subcategory !== cat.id) {
      const tempProducts = products.filter(
        (product) =>
          cat.category_id === values.product_category &&
          product.subcategory_id === cat.id
      );
      setFilteredProducts(tempProducts);
      setFieldValue("product", "");
      setFieldValue("accessories", "");
      setSelectedProduct(null);
      setSelectedAccessories([]);
    }
  };

  const setImageField = (setFieldValue, e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      if (
        SUPPORTED_FORMATS.includes(file.type) &&
        file.size / 1024 < FILE_SIZE
      ) {
        setFieldValue("document", e.target.files[0]);
        setFieldValue("document_path", URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const printDetails = () => {
    if (formRef && formRef["current"] && formRef.current["values"]) {
      setFormValues(formRef.current.values);
    }
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const showProductInfo = (product, selected_accessories_data) => {
    const product_data = products.filter(
      (_product) => _product["id"] === product
    );
    let total = 0;
    if (product_data.length > 0) {
      setTimeout(() => {
        setSelectedProduct(product_data[0]);
      });
      total =
        product_data[0].vehicle_cost +
        product_data[0].road_tax_cost +
        product_data[0].reg_handling_cost +
        product_data[0].min_accessories_cost +
        product_data[0].extra_fitting_cost;
    }
    if (selected_accessories_data && selected_accessories_data.length > 0) {
      selected_accessories_data.forEach((access) => {
        total += access["price"];
      });
    }
    return product_data.length > 0 ? (
      <div>
        <table className="display-table">
          <tbody>
            <tr>
              <td>
                <b>Cost</b>
              </td>
              <td>{product_data[0].vehicle_cost} INR</td>
            </tr>
            <tr>
              <td>
                <b>Registration</b>
              </td>
              <td>{product_data[0].reg_handling_cost} INR</td>
            </tr>
            <tr>
              <td>
                <b>Road Tax</b>
              </td>
              <td>{product_data[0].road_tax_cost} INR</td>
            </tr>
            <tr>
              <td>
                <b>Insurance</b>
              </td>
              <td>{product_data[0].insurance_cost} INR</td>
            </tr>
            <tr>
              <td>
                <b>Extra Fitting</b>
              </td>
              <td>{product_data[0].extra_fitting_cost} INR</td>
            </tr>
            <tr>
              <td>
                <b>Min. Accessories</b>
              </td>
              <td>{product_data[0].min_accessories_cost} INR</td>
            </tr>

            {selected_accessories_data &&
            selected_accessories_data.length > 0 ? (
              <tr>
                <td colSpan="2">
                  <b>Accessories</b>
                </td>
              </tr>
            ) : null}
            {selected_accessories_data && selected_accessories_data.length > 0
              ? selected_accessories_data.map((access) => (
                  <tr key={`accessories_${access["id"]}`}>
                    <td>{access["name"]}</td>
                    <td>{access["price"]} INR</td>
                  </tr>
                ))
              : null}
            <tr>
              <td>
                <b>Total Cost</b>
              </td>
              <td>{total} INR</td>
            </tr>
            <tr className="text-center">
              <td colSpan="2" style={{ cursor: "pointer" }}>
                <p onClick={printDetails}>
                  <b>Print Details</b>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : null;
  };

  const getTotalPrice = (product, accesories_data) => {
    let total =
      product.vehicle_cost +
      product.road_tax_cost +
      product.reg_handling_cost +
      product.min_accessories_cost +
      product.extra_fitting_cost;
    if (accesories_data) {
      accesories_data.forEach((temp_access) => {
        total += temp_access["price"];
      });
    }
    return total;
  };

  const submitForm = async (values, setErrors) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {
      if (
        fieldName === "sales_executive" ||
        fieldName === "priority" ||
        fieldName === "buying_date" ||
        fieldName === "finance_type" ||
        fieldName === "lead_type" ||
        fieldName === "lead_category" ||
        fieldName === "payment_type" ||
        fieldName === "accessories"
      ) {
        fData.append(fieldName, JSON.stringify(values[fieldName]));
      } else {
        fData.append(fieldName, values[fieldName]);
      }
    });
    const response = await saveLead(fData);
    if (response["success"]) {
      history.push("../sales");
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  return (
    <>
      <Card id="form-data">
        <CardHeader>
          <CardTitle>
            {action === "add" ? "Add New Sales Lead" : "Edit Lead"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            innerRef={formRef}
            initialValues={{
              id: lead ? lead["id"] : "",
              enquiry_id: lead ? lead["enquiry_id"] : "",
              lead_type: lead ? lead["lead_type"] : "",
              lead_category: lead ? lead["lead_category"] : "",
              firstname: lead ? lead["firstname"] : "",
              lastname: lead ? lead["lastname"] : "",
              age: lead ? lead["age"] : "",
              email: lead ? lead["email"] : "",
              contact: lead ? lead["contact"] : "",
              alternate_contact: lead ? lead["alternate_contact"] : "",
              address: lead ? lead["address"] : "",
              location: lead ? lead["location"] : "",
              city: lead ? lead["city"] : "",
              pincode: lead ? lead["pincode"] : "",
              product_category: lead ? lead["product_category"] : "",
              product_subcategory: lead ? lead["product_subcategory"] : "",
              product: lead ? lead["product"] : "",
              product_user: lead ? lead["product_user"] : "",
              finance_type: lead ? lead["finance_type"] : "",
              payment_type: lead ? lead["payment_type"] : "",
              advance_payment: lead ? lead["advance_payment"] : 0,
              buying_date: lead ? lead["buying_date"] : "",
              priority: lead ? lead["priority"] : "",
              sales_executive: lead ? lead["sales_executive"] : "",
              delivery_date: lead ? lead["delivery_date"] : "",
              document: lead ? lead["document"] : "",
              document_path: lead ? lead["document_path"] : "",
              accessories: lead ? lead["accessories"] : "",
            }}
            enableReinitialize={true}
            validationSchema={schemaObj}
            onSubmit={(data, { setErrors }) => submitForm(data, setErrors)}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <h6>Lead Details</h6>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lead_type">Lead Type</Label>
                      <Select
                        id="lead_type"
                        className={
                          errors.lead_type && touched.lead_type
                            ? " is-invalid"
                            : ""
                        }
                        name="lead_type"
                        options={lead_types}
                        onChange={(e) => setFieldValue("lead_type", e)}
                        value={values.lead_type}
                        error={errors.lead_type ?? "invalid"}
                        touched={touched.lead_type ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="lead_type"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lead_category">Lead Category</Label>
                      <Select
                        id="lead_category"
                        className={
                          errors.lead_category && touched.lead_category
                            ? " is-invalid"
                            : ""
                        }
                        name="lead_category"
                        options={lead_categories}
                        onChange={(e) => setFieldValue("lead_category", e)}
                        value={values.lead_category}
                        error={errors.lead_category ?? "invalid"}
                        touched={touched.lead_category ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="lead_category"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h6>Customer Details</h6>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="firstname">Firstname</Label>
                      <Field
                        name="firstname"
                        id="firstname"
                        className={`form-control ${
                          errors.firstname && touched.firstname && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="firstname"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="lastname">Lastname</Label>
                      <Field
                        name="lastname"
                        id="lastname"
                        className={`form-control ${
                          errors.lastname && touched.lastname && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="lastname"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="age">
                        Age <sub>(In Years)</sub>
                      </Label>
                      <Field
                        name="age"
                        id="age"
                        className={`form-control ${
                          errors.age && touched.age && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="age"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Field
                        name="email"
                        id="email"
                        className={`form-control ${
                          errors.email && touched.email && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="contact">Contact No</Label>
                      <Field
                        name="contact"
                        id="contact"
                        className={`form-control ${
                          errors.contact && touched.contact && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="alternate_contact">Alternate No</Label>
                      <Field
                        name="alternate_contact"
                        id="alternate_contact"
                        className={`form-control ${
                          errors.alternate_contact &&
                          touched.alternate_contact &&
                          "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="alternate_contact"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="address">Address</Label>
                      <Field
                        name="address"
                        id="address"
                        className={`form-control ${
                          errors.address && touched.address && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="location">Location</Label>
                      <Field
                        name="location"
                        id="location"
                        className={`form-control ${
                          errors.location && touched.location && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="city">City</Label>
                      <Field
                        name="city"
                        id="city"
                        className={`form-control ${
                          errors.city && touched.city && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pincode">Pincode</Label>
                      <Field
                        name="pincode"
                        id="pincode"
                        type="number"
                        className={`form-control ${
                          errors.pincode && touched.pincode && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h6>Product Details</h6>
                <Row>
                  <Col md={6}>
                    <Row>
                      <Col md={12}>
                        <ReactSelectField
                          label="Product Category"
                          options={categories}
                          name="product_category"
                          selected={values.product_category}
                          error={errors.product_category}
                          touched={touched.product_category}
                          setFieldValue={setFieldValue}
                          onChangeEvent={(e) =>
                            onChangeCategory(e, values, setFieldValue)
                          }
                          labelKey="name"
                          valueKey="id"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <ReactSelectField
                          label="Product Sub-Category"
                          options={filteredSubCats}
                          name="product_subcategory"
                          selected={values.product_subcategory}
                          error={errors.product_subcategory}
                          touched={touched.product_subcategory}
                          setFieldValue={setFieldValue}
                          onChangeEvent={(e) =>
                            onChangeSubCategory(e, values, setFieldValue)
                          }
                          labelKey="name"
                          valueKey="id"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <ReactSelectField
                          label="Product"
                          options={filteredProducts}
                          name="product"
                          selected={values.product}
                          error={errors.product}
                          touched={touched.product}
                          setFieldValue={setFieldValue}
                          labelKey="name"
                          onChange={(e) => {
                            setFieldValue("accessories", "");
                            setSelectedAccessories([]);
                            setFieldValue("product", e);
                          }}
                          valueKey="id"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="lead_category">Accessories</Label>
                          <Select
                            id="accessories"
                            className={
                              errors.accessories && touched.accessories
                                ? " is-invalid"
                                : ""
                            }
                            name="accessories"
                            options={allAccessories}
                            onChange={(e) => {
                              setSelectedAccessories(e);
                              setFieldValue("accessories", e);
                            }}
                            value={values.accessories}
                            error={errors.accessories ?? "invalid"}
                            touched={touched.accessories ?? "assad"}
                            getOptionLabel={(option) => option["name"]}
                            getOptionValue={(option) => option["id"]}
                            isMulti={true}
                          />
                          <ErrorMessage
                            name="accessories"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <h5>Product Info</h5>
                    {values.product !== "" && values.product !== null ? (
                      showProductInfo(values.product, values.accessories)
                    ) : (
                      <p>No Product Selected</p>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="product_user">Product User</Label>
                      <Field
                        name="product_user"
                        id="product_user"
                        className={`form-control ${
                          errors.product_user &&
                          touched.product_user &&
                          "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="product_user"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="buying_date">Expected time to buy</Label>
                      <Select
                        id="buying_date"
                        className={
                          errors.buying_date && touched.buying_date
                            ? " is-invalid"
                            : ""
                        }
                        name="buying_date"
                        options={buying_date_option}
                        onChange={(e) => setFieldValue("buying_date", e)}
                        value={values.buying_date}
                        error={errors.buying_date ?? "invalid"}
                        touched={touched.buying_date ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="buying_date"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="payment_type">Payment Type</Label>
                      <Select
                        id="payment_type"
                        className={
                          errors.payment_type && touched.payment_type
                            ? " is-invalid"
                            : ""
                        }
                        name="payment_type"
                        options={payment_types}
                        onChange={(e) => setFieldValue("payment_type", e)}
                        value={values.payment_type}
                        error={errors.payment_type ?? "invalid"}
                        touched={touched.payment_type ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="payment_type"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="finance_type">Finance Type</Label>
                      <Select
                        id="finance_type"
                        className={
                          errors.finance_type && touched.finance_type
                            ? " is-invalid"
                            : ""
                        }
                        name="finance_type"
                        options={finance_types}
                        onChange={(e) => setFieldValue("finance_type", e)}
                        value={values.finance_type}
                        error={errors.finance_type ?? "invalid"}
                        touched={touched.finance_type ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="finance_type"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="advance_payment">Advance Payment</Label>
                      <Field
                        name="advance_payment"
                        id="advance_payment"
                        type="number"
                        className={`form-control ${
                          errors.advance_payment &&
                          touched.advance_payment &&
                          "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="advance_payment"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="priority">Priority</Label>
                      <Select
                        id="priority"
                        className={
                          errors.priority && touched.priority
                            ? " is-invalid"
                            : ""
                        }
                        name="priority"
                        options={priority_types}
                        onChange={(e) => setFieldValue("priority", e)}
                        value={values.priority}
                        error={errors.priority ?? "invalid"}
                        touched={touched.priority ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["name"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="priority"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="delivery_date">Delivery Date</Label>
                      <Field
                        type="date"
                        name="delivery_date"
                        id="delivery_date"
                        className={`form-control ${
                          errors.delivery_date &&
                          touched.delivery_date &&
                          "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="delivery_date"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="sales_executive">Sales Executive</Label>
                      <Select
                        id="sales_executive"
                        className={
                          errors.sales_executive && touched.sales_executive
                            ? " is-invalid"
                            : ""
                        }
                        name="sales_executive"
                        options={sales_executives}
                        onChange={(e) => setFieldValue("sales_executive", e)}
                        value={values.sales_executive}
                        error={errors.sales_executive ?? "invalid"}
                        touched={touched.sales_executive ?? "assad"}
                        getOptionLabel={(option) => option["fullname"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="sales_executive"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <div className="d-flex flex-wrap mt-2">
                        <label
                          className="btn btn-primary mr-3"
                          htmlFor="upload-document"
                          color="primary"
                        >
                          Upload Customer Document
                          <input
                            type="file"
                            name="document"
                            id="upload-document"
                            onChange={(e) => setImageField(setFieldValue, e)}
                            accept={ACCEPTED_MEDIA_TYPES}
                            hidden
                          />
                        </label>
                        {values.document_path ? (
                          <a
                            className="mr-3"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={getImagePath(values.document_path)}
                            alt={values.name}
                          >
                            View Uploaded Doc
                          </a>
                        ) : (
                          ""
                        )}
                        {values.document_path && values.document_path.length ? (
                          <span
                            className="danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setFieldValue("document", "");
                              setFieldValue("document_path", "");
                            }}
                          >
                            Remove Document
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="text-center">
                    <Button.Ripple
                      disabled={isSubmitting}
                      className="mt-1"
                      color="primary"
                      outline
                      type="submit"
                    >
                      {action === "add" ? "Add" : "Save"}
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
      {selected_product ? (
        <Row id="print_table">
          <Col className="invoice-wrapper" sm="12">
            <Card className="invoice-page">
              <CardBody>
                <Row>
                  <Col md="6" sm="12" className="pt-1">
                    <Media className="pt-1">
                      <img src={logo} alt="logo" />
                    </Media>
                  </Col>
                  <Col md="6" sm="12" className="text-right">
                    <h1>Invoice</h1>
                    <div className="invoice-details mt-2">
                      <h6 className="mt-2">INVOICE DATE</h6>
                      <p>
                        {new Date().getDate()}{" "}
                        {months[new Date().getMonth() + 1]},{" "}
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="pt-2">
                  <Col md="6" sm="12">
                    <h5>Recipient</h5>
                    <div className="recipient-info my-2">
                      {form_values ? (
                        <>
                          <p>
                            {form_values["firstname"]} {form_values["lastname"]}
                          </p>
                          <p>{form_values["address"]}</p>
                          {/* <p>{form_values['location']}</p> */}
                          <p>
                            {form_values["city"]} {form_values["pincode"]}
                          </p>
                        </>
                      ) : null}
                    </div>
                    <div className="recipient-contact pb-2">
                      {form_values && form_values["email"] ? (
                        <p>
                          <Mail size={15} className="mr-50" />
                          {form_values["email"]}
                        </p>
                      ) : null}
                      {form_values && form_values["contact"] ? (
                        <p>
                          <Phone size={15} className="mr-50" />
                          {form_values["contact"]}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col md="6" sm="12" className="text-right">
                    <h5>TVS Honda</h5>
                    <div className="company-info my-2">
                      <p>9 N. Sherwood Court</p>
                      <p>Elyria, OH</p>
                      <p>94203</p>
                    </div>
                    <div className="company-contact">
                      <p>
                        <Mail size={15} className="mr-50" />
                        hello@pixinvent.net
                      </p>
                      <p>
                        <Phone size={15} className="mr-50" />
                        +91 999 999 9999
                      </p>
                    </div>
                  </Col>
                </Row>
                <div className="invoice-items-table pt-1">
                  <Row>
                    <Col sm="12">
                      <Table responsive borderless>
                        <thead>
                          <tr>
                            <th>Items</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <b>
                                {selected_product.name} (
                                {selected_product.varients.name})
                              </b>
                            </td>
                            <td>1</td>
                            <td>{selected_product.vehicle_cost} INR</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Registration</b>
                            </td>
                            <td></td>
                            <td>{selected_product.reg_handling_cost} INR</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Road Tax</b>
                            </td>
                            <td></td>
                            <td>{selected_product.road_tax_cost} INR</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Insurance</b>
                            </td>
                            <td></td>
                            <td>{selected_product.insurance_cost} INR</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Extra Fitting</b>
                            </td>
                            <td></td>
                            <td>{selected_product.extra_fitting_cost} INR</td>
                          </tr>

                          {selected_accessories &&
                          selected_accessories.length > 0 ? (
                            <tr>
                              <td colSpan="2">
                                <b>Extra Accesories</b>
                              </td>
                            </tr>
                          ) : null}
                          {selected_accessories &&
                          selected_accessories.length > 0
                            ? selected_accessories.map((access, key) => (
                                <tr key={`accessories_${access["id"]}`}>
                                  <td className="pl-3">
                                    <b>
                                      {key + 1}. {access["name"]}
                                    </b>
                                  </td>
                                  <td></td>
                                  <td>{access["price"]} INR</td>
                                </tr>
                              ))
                            : null}
                          {/* <tr>
                              <td>
                                <b>Total Cost</b>
                              </td>
                              <td></td>
                              <td>
                                
                              </td>
                            </tr> */}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
                <div className="invoice-total-table">
                  <Row>
                    <Col
                      sm={{ size: 7, offset: 5 }}
                      xs={{ size: 7, offset: 5 }}
                    >
                      <Table responsive borderless>
                        <tbody>
                          <tr>
                            <th>SUBTOTAL</th>
                            <td>
                              <b>
                                {getTotalPrice(
                                  selected_product,
                                  selected_accessories
                                )}{" "}
                                INR
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <th>TOTAL</th>
                            <td>
                              <b>
                                {getTotalPrice(
                                  selected_product,
                                  selected_accessories
                                )}{" "}
                                INR
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
                <div className="text-right pt-3 invoice-footer">
                  <p>For any queries, please contact your us. Thanks!</p>
                  {/* <p className="bank-details mb-0">
                      <span className="mr-4">
                        BANK: <strong>FTSBUS33</strong>
                      </span>
                      <span>
                        IBAN: <strong>G882-1111-2222-3333</strong>
                      </span>
                    </p> */}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default AddSalesLead;
