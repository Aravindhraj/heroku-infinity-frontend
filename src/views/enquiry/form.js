import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Card, CardBody, Label, FormGroup, Col, Row, CardHeader, CardTitle, Button } from 'reactstrap';
import { setNullToEmpty, setErrorObject } from '../../helper/formik.helper';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { fetchActiveProducts } from '../../services/product.service';
import { saveEnquiry, getEnquiry } from '../../services/enquiry.service';
import { history } from './../../history';
import { fetchSalesPerson } from '../../services/users.service';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schemaObj = Yup.object().shape({
  firstname: Yup.string().required("Enter Firstname"),
  lastname: Yup.string().nullable(),
  email: Yup.string().email("Enter Valid Email").nullable(),
  phone: Yup.string().matches(phoneRegExp, 'Enter 10 digit phone number').required("Enter Phone number"),
  city: Yup.string().nullable(),
  pincode: Yup.string().nullable(),
  product_id: Yup.number().required("Select Product"),
  type: Yup.string().required("Select Enquiry Type"),
  expected_to_buy: Yup.string().nullable(),
  priority: Yup.string().required("Select Priority"),
  description: Yup.string().nullable(),
  sales_user: Yup.number().required("Select Sales Person")
});

const buying_date_option = [
  { name: "Ready to buy" },
  { name: "One week" },
  { name: "2 week" },
  { name: "3 week" },
  { name: "Month later" },
  { name: "Not Sure" },
];

const EnquiryForm = ({ match }) => {
  const [enquiry, setEnquiry] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales_executive, setSalesExecutives] = useState([]);
  const [action, setAction] = useState('add');

  const enq_type = [
    "Walking",
    "Phone",
    "Activity Team",
    "Mech Ref",
    "Today Booking",
    "AMMM Sch",
    "Bank Quote"
  ];

  const priority_type = [
    "Urgent",
    "High",
    "Low"
  ];

  useEffect(() => {
    if (match.params.id) {
      async function getEnquiryData() {
        const temp_enq = await getEnquiry(match.params.id);

        if (temp_enq) {
          setEnquiry(temp_enq);
          setAction('edit');
        } else {
          history.push("../enquiry");
        }
      }
      getEnquiryData();
    }
  }, [match.params.id]);

  useEffect(() => {
    async function fetchSalesPersonData() {
      const sales_persons = await fetchSalesPerson();
      if (sales_persons)
        setSalesExecutives(sales_persons);
    }
    fetchSalesPersonData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const products = await fetchActiveProducts();
      setProducts(products);
    }
    fetchData();
  }, []);

  const submitForm = async (data, setErrors) => {
    const response = await saveEnquiry(data);
    if (response['success']) {
      history.push('../enquiry')
    } else {
      setErrors(setErrorObject(response['errors']));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action === 'add' ? 'Add Enquiry' : 'Edit Enquiry'}</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            id: enquiry ? enquiry['id'] : "",
            firstname: enquiry ? setNullToEmpty(enquiry['firstname']) : "",
            lastname: enquiry ? setNullToEmpty(enquiry['lastname']) : "",
            email: enquiry ? setNullToEmpty(enquiry['email']) : "",
            phone: enquiry ? setNullToEmpty(enquiry['phone']) : "",
            pincode: enquiry ? setNullToEmpty(enquiry['pincode']) : "",
            city: enquiry ? setNullToEmpty(enquiry['city']) : "",
            product_id: (products && products.length > 0 && !enquiry) ? "" : (enquiry ? enquiry['product_id'] : ""),
            type: enquiry ? setNullToEmpty(enquiry['type']) : "",
            expected_to_buy: enquiry ? setNullToEmpty(enquiry['expected_to_buy']) : "",
            priority: enquiry ? setNullToEmpty(enquiry['priority']) : "",
            description: enquiry ? setNullToEmpty(enquiry['description']) : "",
            sales_user: (sales_executive && sales_executive.length > 0 && !enquiry) ? "" : (enquiry ? enquiry['sales_user'] : ""),
           
          }}
          enableReinitialize={true}
          validationSchema={schemaObj}
          onSubmit={(data, { setErrors }) => submitForm(data, setErrors)}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="firstname">Firstname</Label>
                    <Field
                      name="firstname"
                      id="firstname"
                      className={`form-control ${errors.firstname &&
                        touched.firstname &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="lastname">Lastname</Label>
                    <Field
                      name="lastname"
                      id="lastname"
                      className={`form-control ${errors.lastname &&
                        touched.lastname &&
                        "is-invalid"}`}
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
                  <FormGroup className="">
                    <Label for="email">Email</Label>
                    <Field
                      name="email"
                      id="email"
                      className={`form-control ${errors.email &&
                        touched.email &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="email">Phone</Label>
                    <Field
                      name="phone"
                      id="phone"
                      className={`form-control ${errors.phone &&
                        touched.phone &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="field-error text-danger" />
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
                      className={`form-control ${errors.city &&
                        touched.city &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="pincode">Pincode</Label>
                    <Field
                      name="pincode"
                      id="pincode"
                      className={`form-control ${errors.pincode &&
                        touched.pincode &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="pincode"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="product_id">Product</Label>
                    <Field
                      as="select"
                      name="product_id"
                      id="product_id"
                      className={`form-control ${errors.product_id &&
                        touched.product_id &&
                        "is-invalid"}`}
                    >
                      <option disabled value="">Select Product</option>
                      {
                        products ? products.map(product => (<option key={product.id} value={product.id}>{product.name}</option>)) : null
                      }
                    </Field>
                    <ErrorMessage
                      name="product_id"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                <FormGroup>
                    <Label for="expected_to_buy">Expected time to buy</Label>
                    <Field
                      as="select"
                      name="expected_to_buy"
                      id="expected_to_buy"
                      className={`form-control ${errors.expected_to_buy &&
                        touched.expected_to_buy &&
                        "is-invalid"}`}
                    >
                      <option disabled value="">Select expected buying time</option>
                      {
                        buying_date_option ? buying_date_option.map(buying_date => (<option key={buying_date.name} value={buying_date.name}>{buying_date.name}</option>)) : null
                      }
                    </Field>
                    <ErrorMessage
                      name="expected_to_buy"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="role">Enquiry Type</Label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      className={`form-control ${errors.type &&
                        touched.type &&
                        "is-invalid"}`}
                    >
                      <option disabled value="">Select Type</option>
                      {
                        enq_type.map(enq => (<option key={enq} value={enq}>{enq}</option>))
                      }
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="role">Priority</Label>
                    <Field
                      as="select"
                      id="priority"
                      name="priority"
                      className={`form-control ${errors.priority &&
                        touched.priority &&
                        "is-invalid"}`}
                    >
                      <option disabled value="">Select Priority</option>
                      {
                        priority_type.map(p_type => (<option key={p_type} value={p_type}>{p_type}</option>))
                      }
                    </Field>
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="pincode">Sales Executive</Label>
                    <Field
                      as="select"
                      name="sales_user"
                      id="sales_user"
                      className={`form-control ${errors.sales_user &&
                        touched.sales_user &&
                        "is-invalid"}`}
                    >
                      <option disabled value="">Select a Sales Executive</option>
                      {
                        sales_executive ? sales_executive.map(s_person => (<option key={s_person.id} value={s_person.id}>{s_person.firstname} {s_person.lastname}</option>)) : null
                      }
                    </Field>
                    <ErrorMessage
                      name="sales_user"
                      component="div"
                      className="field-error text-danger" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      className={`form-control ${errors.description &&
                        touched.description &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="text-center">
                  <Button.Ripple disabled={isSubmitting} className="mt-1" color="primary" outline type="submit">
                    {action === 'add' ? "Add" : "Save"}
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );

}

export default EnquiryForm;