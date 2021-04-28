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
import {fetchUsersByType} from "../../services/users.service";
import Select from "react-select";
import { saveServiceSchedule, getServiceSchedule } from "../../services/service-schedule.service";
import { setErrorObject } from "../../helper/formik.helper";
import "../../assets/scss/pages/invoice.scss";
import Toggle from "react-toggle";

const schemaObj = Yup.object().shape({
  customer: Yup.string().required("Select Customer"),
  product: Yup.string().required("Select Product"),
  purchase_date: Yup.date().max(
    new Date(Date.now() + 86400000),
    "Select Today's Date or Past Date"
  ),
  service_type: Yup.string().required("Select Service Type"),
  service_round: Yup.number().required("Enter Service round number"),
  service_date: Yup.date().min(
    new Date(Date.now() - 86400000),
    "Select Today's Date or Future Date"
  ),
  service_time: Yup.string().required("Select Service Time"),
  
});

const initialValues = {
  id: "",
  customer: "",
  product: "",
  purchase_date: "",
  service_type: "",
  service_round: "",
  service_date: "",
  service_time:"",
  notify_customer:true
};

const AddServiceSchedule = ({ match, history }) => {
  const formRef = useRef();
  const [serviceSchedule, setServiceSchedule] = useState(initialValues);
  const [action, setAction] = useState("add");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
//   const [servicePersons, setServicePersons] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selected_product, setSelectedProduct] = useState(null);
  const [form_values, setFormValues] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    //fetchServicePersons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (match.params.id) {
      async function getServiceScheduleData() {
        const temp_serv_schedule_data = await getServiceSchedule(match.params.id);

        if (temp_serv_schedule_data) {
          if (temp_serv_schedule_data["service_date"]) {
            const temp_date = new Date(temp_serv_schedule_data["service_date"]);
            let month = temp_date.getMonth();
            month = parseInt(month) + 1;
            if (month < 10) {
              month = "0" + month;
            }
            temp_serv_schedule_data["service_date"] =
              temp_date.getFullYear() + "-" + month + "-" + temp_date.getDate();
          }

          if(temp_serv_schedule_data["product_data"]){
            temp_serv_schedule_data["product"] = temp_serv_schedule_data["product_data"];
          }

          if(temp_serv_schedule_data["customer_data"]){
            temp_serv_schedule_data["customer"] = temp_serv_schedule_data["customer_data"];
            temp_serv_schedule_data["customer"].fullname = temp_serv_schedule_data["customer"].firstname+" "+temp_serv_schedule_data["customer"].lastname;
          }

          if(temp_serv_schedule_data["serviced_by_data"]){
            temp_serv_schedule_data["serviced_by"] = temp_serv_schedule_data["serviced_by_data"];
            temp_serv_schedule_data["serviced_by"].fullname = temp_serv_schedule_data["serviced_by"].firstname+" "+temp_serv_schedule_data["serviced_by"].lastname;
          }

          setServiceSchedule(temp_serv_schedule_data);
          setAction("edit");
          setTimeout(() => {
            if (formRef && formRef["current"] && formRef.current["values"]) {
              setFormValues(formRef.current.values);
            }
          });
        } else {
          history.push("../service-schedule");
        }
      }
      getServiceScheduleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);


  const fetchCustomers = async() => {
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

//   const fetchServicePersons = async() => {
//     const servicePersons = await fetchAllServicePersons();

//     console.log(servicePersons);

//     if (servicePersons) {
//       requestAnimationFrame(() => {
//         servicePersons.forEach((val, key) => {
//           servicePersons[key]["fullname"] =
//             val["firstname"] + " " + val["lastname"];
//         });
//         setServicePersons(servicePersons);
//         console.log(servicePersons);
//       });
//     }
//     fetchAllServicePersons();
//};


  const fetchProducts = async () => {
    const products_data = await fetchActiveProducts();
    setProducts(products_data);
  };

  const submitForm = async (values, setErrors) => {
    const fData = new FormData();
    Object.keys(values).forEach((fieldName) => {

        if (
          fieldName === "customer" ||
          fieldName === "product" ||
          fieldName === "serviced_by"
        ) {
          fData.append(fieldName, JSON.stringify(values[fieldName]));
        } else {
          fData.append(fieldName, values[fieldName]);
        }

    });
    const response = await saveServiceSchedule(fData);
    if (response["success"]) {
      history.push("../service-schedule");
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  return (
    <>
      <Card id="form-data">
        <CardHeader>
          <CardTitle>
            {action === "add" ? "Add New Service Schedule" : "Edit Service Schedule"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            innerRef={formRef}
            initialValues={{
              id: serviceSchedule ? serviceSchedule["id"] : "",
              customer: serviceSchedule ? serviceSchedule["customer"] : "",
              product: serviceSchedule ? serviceSchedule["product"] : "",
              purchase_date: serviceSchedule ? serviceSchedule["purchase_date"] : "",
              service_type: serviceSchedule ? serviceSchedule["service_type"] : "",
              service_round: serviceSchedule ? serviceSchedule["service_round"] : "",
              service_date: serviceSchedule ? serviceSchedule["service_date"] : "",
              service_time: serviceSchedule ? serviceSchedule["service_time"] : "",
              notify_customer:serviceSchedule ? serviceSchedule["notify_customer"] : ""
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
                      <Label for="purchase_date">Purchase Date</Label>
                      <Field
                        type="date"
                        name="purchase_date"
                        id="purchase_date"
                        className={`form-control ${
                          errors.purchase_date &&
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


                  <Col md={6}>
                    <FormGroup>
                      <Label for="service_type">Service Type</Label>
                      <Field
                        name="service_type"
                        id="service_type"
                        className={`form-control ${
                          errors.service_type && touched.service_type && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="service_type"
                        component="div"
                        className="field-error text-danger"
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
                        className={`form-control ${
                          errors.service_round && touched.service_round && "is-invalid"
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
                      <Label for="service_date">Service Date</Label>
                      <Field
                        type="date"
                        name="service_date"
                        id="service_date"
                        className={`form-control ${
                          errors.service_date &&
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
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="service_time">Service Time</Label>
                      <Field
                        name="service_time"
                        id="service_time"
                        className={`form-control ${
                          errors.service_time && touched.service_time && "is-invalid"
                        }`}
                      />
                      <ErrorMessage
                        name="service_time"
                        component="div"
                        className="field-error text-danger"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="data-icon">Notify Customer</Label>
                      <label className="react-toggle-wrapper">
                        <Toggle
                          checked={values.notify_customer}
                          icons={false}
                          name="notify_customer"
                          onChange={(e) => {
                            console.log(e.target.checked);
                            setFieldValue("notify_customer", !values.notify_customer);
                          }}
                        />
                      </label>
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

export default AddServiceSchedule;
