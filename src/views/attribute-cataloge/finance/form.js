import React, { useState, useEffect } from "react";
import { CardBody, CardHeader, CardTitle, Card, FormGroup, Label, Row, Col, Button } from "reactstrap";
import { Formik, Field, Form, ErrorMessage, } from "formik"
import * as Yup from "yup"
import { history } from './../../../history';
import { getFinance, saveFinance } from './../../../services/finance.service';
import { setErrorObject, setNullToEmpty } from './../../../helper/formik.helper';

const schemaObj = Yup.object().shape({
  name: Yup.string().required("Enter Name"),
  provider: Yup.string().required("Enter Provider"),
  description: Yup.string(),
  status: Yup.boolean()
});

const FinanceForm = ({ match }) => {
  const [finance, setFinance] = useState(null);
  const [action, setAction] = useState('add');

  useEffect(() => {
    const fetchFinance = async () => {
      if (match.params.id) {
        const temp_finance = await getFinance(match.params.id);
        setFinance(temp_finance);
        setAction('edit');
      }
    };
    fetchFinance();
  }, [match.params.id]);

  const submitForm = async (data, setErrors) => {
    const response = await saveFinance(data);
    if (response['success']) {
      history.push('../finance')
    } else {
      setErrors(setErrorObject(response['errors']));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action === 'add' ? 'Add Finance' : 'Edit Finance'}</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            id: finance ? finance['id'] : "",
            name: finance ? setNullToEmpty(finance['name']) : "",
            provider: finance ? setNullToEmpty(finance['provider']) : "",
            description: finance ? setNullToEmpty(finance['description']) : "",
            status: finance ? finance['status'] : true,
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
                    <Label for="provider">Provider</Label>
                    <Field
                      name="provider"
                      id="provider"
                      className={`form-control ${errors.provider &&
                        touched.provider &&
                        "is-invalid"}`}
                    />
                    <ErrorMessage
                      name="provider"
                      component="div"
                      className="field-error text-danger"
                    />
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
    </Card >)
}

export default FinanceForm;