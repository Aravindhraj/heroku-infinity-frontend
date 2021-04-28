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
import * as Yup from "yup";
import { fetchActiveProducts } from "../../services/product.service";
import { fetchUsersByType } from "../../services/users.service";
import Select from "react-select";
import { saveServiceHistory, getServiceHistory } from "../../services/service-history.service";
import { setErrorObject } from "../../helper/formik.helper";
import "../../assets/scss/pages/invoice.scss";

import {
  getRecords, getOptionsByTable
} from "../../services/general-table.service";
import { ReactSelectField } from "../../components/form-fields/react-select-field";

const schemaObj = Yup.object().shape({
  customer: Yup.string().required("Select Customer"),
  service_round: Yup.number().required("Enter Service round number"),
  problem: Yup.string().required("Enter Problem"),
  product: Yup.string().required("Select Product"),
  service_date: Yup.date().max(
    new Date(Date.now() + 86400000),
    "Select Today's Date or Past Date"
  ),
  serviced_by: Yup.string().required("Select Service Person")
});

const initialValues = {
  id: "",
  customer: "",
  service_round: "",
  problem: "",
  product: "",
  service_date: "",
  serviced_by: "",
  changed_spare_parts:"",
};

const AddServiceHistory = ({ match, history }) => {
  const formRef = useRef();
  const [service, setServiceHistory] = useState(initialValues);
  const [action, setAction] = useState("add");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [servicePersons, setServicePersons] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selected_product, setSelectedProduct] = useState(null);
  const [form_values, setFormValues] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchServicePersons();
    fetchSpareParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (match.params.id) {
      async function getServiceHistoryData() {
        const temp_serv_hist_data = await getServiceHistory(match.params.id);

        if (temp_serv_hist_data) {
          if (temp_serv_hist_data["service_date"]) {
            const temp_date = new Date(temp_serv_hist_data["service_date"]);
            let month = temp_date.getMonth();
            month = parseInt(month) + 1;
            if (month < 10) {
              month = "0" + month;
            }
            temp_serv_hist_data["service_date"] =
              temp_date.getFullYear() + "-" + month + "-" + temp_date.getDate();
          }

          if (temp_serv_hist_data["product_data"]) {
            temp_serv_hist_data["product"] = temp_serv_hist_data["product_data"];
          }

          if (temp_serv_hist_data["customer_data"]) {
            temp_serv_hist_data["customer"] = temp_serv_hist_data["customer_data"];
            temp_serv_hist_data["customer"].fullname = temp_serv_hist_data["customer"].firstname + " " + temp_serv_hist_data["customer"].lastname;
          }

          if (temp_serv_hist_data["serviced_by_data"]) {
            temp_serv_hist_data["serviced_by"] = temp_serv_hist_data["serviced_by_data"];
            temp_serv_hist_data["serviced_by"].fullname = temp_serv_hist_data["serviced_by"].firstname + " " + temp_serv_hist_data["serviced_by"].lastname;
          }

          if (temp_serv_hist_data["spare_part_data"]) {
            temp_serv_hist_data["changed_spare_parts"] = temp_serv_hist_data["spare_part_data"];
          }

          setServiceHistory(temp_serv_hist_data);
          setAction("edit");
          setTimeout(() => {
            if (formRef && formRef["current"] && formRef.current["values"]) {
              setFormValues(formRef.current.values);
            }
          });
        } else {
          history.push("../service-history");
        }
      }
      getServiceHistoryData();
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

  const fetchServicePersons = async () => {
    const servicePersons = await fetchUsersByType("Service Job");
    if (servicePersons) {
      requestAnimationFrame(() => {
        servicePersons.forEach((val, key) => {
          servicePersons[key]["fullname"] =
            val["firstname"] + " " + val["lastname"];
        });
        setServicePersons(servicePersons);
      });
    }
    fetchUsersByType("Service Job");

  };

  const fetchSpareParts = async () => {
    const sparePartsRes = await getOptionsByTable("table/spare-parts");


    if (sparePartsRes) {
      requestAnimationFrame(() => {
        // spareParts.forEach((val, key) => {
        //   spareParts[key]["fullname"] =
        //     val["firstname"] + " " + val["lastname"];
        // });
        setSpareParts(sparePartsRes);
      });
    }
    //fetchAllSpareParts();

  };

  const fetchProducts = async () => {
    const products_data = await fetchActiveProducts();
    setProducts(products_data);
  };

  const printDetails = () => {
    if (formRef && formRef["current"] && formRef.current["values"]) {
      setFormValues(formRef.current.values);
    }
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const submitForm = async (values, setErrors) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {

      if (
        fieldName === "customer" ||
        fieldName === "product" ||
        fieldName === "serviced_by" ||
        fieldName === "changed_spare_parts"
      ) {
        fData.append(fieldName, JSON.stringify(values[fieldName]));
      } else {
        fData.append(fieldName, values[fieldName]);
      }





    });
    const response = await saveServiceHistory(fData);
    if (response["success"]) {
      history.push("../service-history");
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  return (
    <>
      <Card id="form-data">
        <CardHeader>
          <CardTitle>
            {action === "add" ? "Add New Service History" : "Edit Service History"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            innerRef={formRef}
            initialValues={{
              id: service ? service["id"] : "",
              customer: service ? service["customer"] : "",
              service_round: service ? service["service_round"] : "",
              problem: service ? service["problem"] : "",
              product: service ? service["product"] : "",
              service_date: service ? service["service_date"] : "",
              serviced_by: service ? service["serviced_by"] : "",
              changed_spare_parts: service ? service["changed_spare_parts"] : ""
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
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="service_round">Service Round</Label>
                      <Field
                        name="service_round"
                        id="service_round"
                        className={`form-control ${errors.service_round && touched.service_round && "is-invalid"
                          }`}
                      />
                      <ErrorMessage
                        name="service_round"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="problem">Problem</Label>
                      <Field
                        name="problem"
                        id="problem"
                        className={`form-control ${errors.problem && touched.problem && "is-invalid"
                          }`}
                      />
                      <ErrorMessage
                        name="problem"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="service_date">Service Date</Label>
                      <Field
                        type="date"
                        name="service_date"
                        id="service_date"
                        className={`form-control ${errors.service_date &&
                          touched.service_date &&
                          "is-invalid"
                          }`}
                      />
                      <ErrorMessage
                        name="service_date"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="serviced_by">Service Person</Label>
                      <Select
                        id="serviced_by"
                        className={
                          errors.serviced_by && touched.serviced_by
                            ? " is-invalid"
                            : ""
                        }
                        name="serviced_by"
                        options={servicePersons}
                        onChange={(e) => setFieldValue("serviced_by", e)}
                        value={values.serviced_by}
                        selected={values.serviced_by}
                        error={errors.serviced_by ?? "invalid"}
                        touched={touched.serviced_by ?? "assad"}
                        getOptionLabel={(option) => option["fullname"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="serviced_by"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                  <FormGroup>
                      <Label for="changed_spare_parts">Changed Spare Part</Label>
                      <Select
                        id="changed_spare_parts"
                        className={
                          errors.changed_spare_parts && touched.changed_spare_parts
                            ? " is-invalid"
                            : ""
                        }
                        name="changed_spare_parts"
                        options={spareParts}
                        onChange={(e) => setFieldValue("changed_spare_parts", e)}
                        value={values.changed_spare_parts}
                        selected={values.changed_spare_parts}
                        error={errors.changed_spare_parts ?? "invalid"}
                        touched={touched.changed_spare_parts ?? "assad"}
                        getOptionLabel={(option) => option["name"]}
                        getOptionValue={(option) => option["id"]}
                        isMulti={false}
                      />
                      <ErrorMessage
                        name="serviced_by"
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

export default AddServiceHistory;
