import React, { useState, useEffect } from "react";
import { CardBody, CardHeader, CardTitle, Card, FormGroup, Label, Row, Col, Button } from "reactstrap";
import { Formik, Field, Form, ErrorMessage, } from "formik"
import * as Yup from "yup"
import { history } from './../../../history';
import { getInsurance, saveInsurance } from './../../../services/insurance.service';
import { setErrorObject, setNullToEmpty } from './../../../helper/formik.helper';

const schemaObj = Yup.object().shape({
  name: Yup.string().required("Enter Name"),
  price: Yup.string().required("Enter Price (In INR)"),
  description: Yup.string(),
  validity: Yup.string().required('Enter Validity'),
  status: Yup.boolean()
});

const InsuranceForm = ({ match }) => {
  const [insurance, setInsurance] = useState(null);
  const [action, setAction] = useState('add');

  useEffect(() => {
    const fetchInsurace = async () => {
      if (match.params.id) {
        const temp_insurace = await getInsurance(match.params.id);
        setInsurance(temp_insurace);
        setAction('edit');
      }
    };
    fetchInsurace();
  }, [match.params.id]);

  const submitForm = async (data, setErrors) => {
    const response = await saveInsurance(data);
    if (response['success']) {
      history.push('../insurance')
    } else {
      setErrors(setErrorObject(response['errors']));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action === 'add' ? 'Add Insurance' : 'Edit Insurance'}</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            id: insurance ? insurance['id'] : "",
            name: insurance ? setNullToEmpty(insurance['name']) : "",
            price: insurance ? setNullToEmpty(insurance['price']) : "",
            description: insurance ? setNullToEmpty(insurance['description']) : "",
            validity: insurance ? setNullToEmpty(insurance['validity']) : "",
            status: insurance ? insurance['status'] : true,
          }}
          enableReinitialize={true}
          validationSchema={schemaObj}
          onSubmit={(data, { setErrors }) => submitForm(data, setErrors)}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Field
                      name="name"
                      id="name"
                      className={`form-control ${errors.name &&
                        touched.name &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="type">Price <sub>(In INR)</sub></Label>
                    <Field
                      name="price"
                      id="price"
                      className={`form-control ${errors.price &&
                        touched.price &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col col={12}>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      className={`form-control ${errors.price &&
                        touched.price &&
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
                <Col col={6}>
                  <FormGroup>
                    <Label for="validity">Validity</Label>
                    <Field
                      name="validity"
                      id="validity"
                      className={`form-control ${errors.price &&
                        touched.price &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="validity"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col col={6}>
                  <FormGroup>
                    <Label for="validity">Status</Label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className={`form-control ${errors.status &&
                        touched.status &&
                        "is-invalid"}`}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>In-Active</option>
                    </Field>
                    <ErrorMessage
                      name="status"
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
  )

}

export default InsuranceForm;