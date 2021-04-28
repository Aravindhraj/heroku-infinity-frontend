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
  Row,
} from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { fetchActiveProducts } from "../../services/product.service";
import { fetchUsersByType } from "../../services/users.service";
import Select from "react-select";
import { savePurchase, getPurchase } from "../../services/purchases.service";
import { setErrorObject } from "../../helper/formik.helper";
import "../../assets/scss/pages/invoice.scss";

const schemaObj = Yup.object().shape({
  customer: Yup.string().required("Select Customer"),
  product: Yup.string().required("Select Product"),
  purchase_date: Yup.date().max(
    new Date(Date.now() + 86400000),
    "Select Today's Date or Past Date"
  ),
  sales_person: Yup.string().required("Select Sales Person")
});

const initialValues = {
  id: "",
  purchase_number: "",
  customer: "",
  product: "",
  purchase_date: "",
  sales_person: "",
};

const AddPurchase = ({ match, history }) => {
  const formRef = useRef();
  const [purchase, setPurchase] = useState(initialValues);
  const [action, setAction] = useState("add");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [form_values, setFormValues] = useState(null);
 
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchSalesPersons();
  }, []);


  useEffect(() => {
    if (match.params.id) {
      async function getPurchasesData() {
        const temp_purchases_data = await getPurchase(match.params.id);

        if (temp_purchases_data) {
          if (temp_purchases_data["purchase_date"]) {
            const temp_date = new Date(temp_purchases_data["purchase_date"]);
            let month = temp_date.getMonth();
            month = parseInt(month) + 1;
            if (month < 10) {
              month = "0" + month;
            }
            temp_purchases_data["purchase_date"] =
              temp_date.getFullYear() + "-" + month + "-" + temp_date.getDate();
          }

          if (temp_purchases_data["product_data"]) {
            temp_purchases_data["product"] = temp_purchases_data["product_data"];
          }

          if (temp_purchases_data["customer_data"]) {
            temp_purchases_data["customer"] = temp_purchases_data["customer_data"];
            temp_purchases_data["customer"].fullname = temp_purchases_data["customer"].firstname + " " + temp_purchases_data["customer"].lastname;
          }

          if (temp_purchases_data["sales_person_data"]) {
            temp_purchases_data["sales_person"] = temp_purchases_data["sales_person_data"];
            temp_purchases_data["sales_person"].fullname = temp_purchases_data["sales_person"].firstname + " " + temp_purchases_data["sales_person"].lastname;
          }

          setPurchase(temp_purchases_data);
          setAction("edit");
          setTimeout(() => {
            if (formRef && formRef["current"] && formRef.current["values"]) {
              setFormValues(formRef.current.values);
            }
          });
        } else {
          history.push("../purchases");
        }
      }
      getPurchasesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);


  const fetchCustomers = async () => {
    const customers = await fetchUsersByType("Customer");
    if (customers) {
      requestAnimationFrame(() => {
        customers.forEach((val, key) => {
          customers[key]["fullname"] =
            val["firstname"] + " " + val["lastname"];
        });
        setCustomers(customers);
      });
    }
    fetchUsersByType("Customer");
  };

  const fetchSalesPersons = async () => {
    const salesPersons = await fetchUsersByType("Sales Executive");
    if (salesPersons) {
      requestAnimationFrame(() => {
        salesPersons.forEach((val, key) => {
          salesPersons[key]["fullname"] =
            val["firstname"] + " " + val["lastname"];
        });
        setSalesPersons(salesPersons);
      });
    }
    fetchUsersByType("Sales Executive");
  };

  const fetchProducts = async () => {
    const products_data = await fetchActiveProducts();
    setProducts(products_data);
  };

  // const printDetails = () => {
  //   if (formRef && formRef["current"] && formRef.current["values"]) {
  //     setFormValues(formRef.current.values);
  //   }
  //   setTimeout(() => {
  //     window.print();
  //   }, 400);
  // };

  const submitForm = async (values, setErrors) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {

      if (
        fieldName === "customer" ||
        fieldName === "product" ||
        fieldName === "sales_person"
      ) {
        fData.append(fieldName, JSON.stringify(values[fieldName]));
      } else {
        fData.append(fieldName, values[fieldName]);
      }
    });
    const response = await savePurchase(fData);
    if (response["success"]) {
      history.push("../purchases");
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  return (
    <>
      <Card id="form-data">
        <CardHeader>
          <CardTitle>
            {action === "add" ? "Add New Purchase" : "Edit Purchase"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            innerRef={formRef}
            initialValues={{
              id: purchase ? purchase["id"] : "",
              purchase_number: purchase ? purchase["purchase_number"] : "",
              customer: purchase ? purchase["customer"] : "",
              product: purchase ? purchase["product"] : "",
              purchase_date: purchase ? purchase["purchase_date"] : "",
              sales_person: purchase ? purchase["sales_person"] : "",
            }}
            enableReinitialize={true}
            validationSchema={schemaObj}
            onSubmit={(data, { setErrors }) => submitForm(data, setErrors)}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="purchase_number">Purchase Number</Label>
                      <Field
                        name="purchase_number"
                        id="purchase_number"
                        className={`form-control ${
                          errors.purchase_number && touched.purchase_number && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="purchase_number"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="customer">Customer</Label>
                      <Select
                        id="customer"
                        className={
                          errors.customer && touched.customer
                            ? " is-invalid"
                            : ""
                        }
                        name="customer"
                        options={customers}
                        onChange={(e) => setFieldValue("customer", e)}
                        value={values.customer}
                        selected={values.customer}
                        error={errors.customer ?? "invalid"}
                        touched={touched.customer ?? "assad"}
                        getOptionLabel={(option) => option["fullname"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>

                  
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="product">Product</Label>
                      <Select
                        id="product"
                        className={
                          errors.product && touched.product
                            ? " is-invalid"
                            : ""
                        }
                        name="product"
                        options={products}
                        onChange={(e) => setFieldValue("product", e)}
                        value={values.product}
                        selected={values.product}
                        error={errors.product ?? "invalid"}
                        touched={touched.product ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="product"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="purchase_date">Purchase Date</Label>
                      <Field
                        type="date"
                        name="purchase_date"
                        id="purchase_date"
                        className={`form-control ${errors.purchase_date &&
                          touched.purchase_date &&
                          "is-invalid"
                          }`}
                      />
                      <ErrorMessage
                        name="purchase_date"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="sales_person">Sales Person</Label>
                      <Select
                        id="sales_person"
                        className={
                          errors.sales_person && touched.sales_person
                            ? " is-invalid"
                            : ""
                        }
                        name="sales_person"
                        options={salesPersons}
                        onChange={(e) => setFieldValue("sales_person", e)}
                        value={values.sales_person}
                        selected={values.sales_person}
                        error={errors.sales_person ?? "invalid"}
                        touched={touched.sales_person ?? "assad"}
                        getOptionLabel={(option) => option["fullname"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="sales_person"
                        component="div"
                        className="invalid-feedback"
                      />
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
    </>
  );
};

export default AddPurchase;
