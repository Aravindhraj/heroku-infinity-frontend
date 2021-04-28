import React, { useState, useEffect } from "react";
import { getReceipt } from "../../services/receipts.service";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "../../components/form-fields/input-field";
import { yupFieldSchema } from "../../helper/formik.helper";
import { saveReceipt } from "../../services/receipts.service";
import { Link } from "react-router-dom";

const initials = {
  id: "",
  name: "",
  contact: "",
  address: "",
  payment_date: "",
  card_number: "",
  amount: 0,
  bank_name: "",
  branch_name: "",
};

const formSchema = Yup.object().shape({
  name: yupFieldSchema("Name", "string", true),
  amount: yupFieldSchema("Amount", "number", true, 1),
  payment_date: yupFieldSchema("Payment Date", "mixed", true),
});

const ProductAdd = ({ match, history }) => {
  const id = match.params.id;
  const [initialValues, setInitialValues] = useState(initials);
  useEffect(() => {
    if (id) {
      getReceiptData();
    }
  }, []);

  const getReceiptData = async () => {
    const res = await getReceipt(id);
    if (res["id"]) {
      const tempInitials = { ...initialValues };
      Object.keys(tempInitials).forEach((fieldName) => {
        tempInitials[fieldName] = res[fieldName];
      });
      tempInitials["payment_date"] = new Date(tempInitials["payment_date"])
        .toISOString()
        .substr(0, 10);
      setInitialValues(tempInitials);
    }
  };

  const submitHandler = async (values) => {
    const postValues = { ...values };
    postValues["amount"] = Math.round(postValues["amount"]);
    const response = await saveReceipt(postValues);
    if (response === "success") {
      history.push("/receipt");
    }
  };
  return (
    <div className={`data-list thumb-view`}>
      <Card>
        <CardHeader>
          <CardTitle>{`${id ? "Edit" : "Add New"} Receipt`}</CardTitle>
          <Button.Ripple
            color="danger"
            type="button"
            tag={Link}
            to="/receipt"
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
                  <Col md={6}>
                    <InputField
                      label="Name"
                      name="name"
                      error={errors.name}
                      touched={touched.name}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Address"
                      name="address"
                      error={errors.address}
                      touched={touched.address}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Contact"
                      name="contact"
                      error={errors.contaat}
                      touched={touched.contaact}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      type="date"
                      label="Payment Date"
                      name="payment_date"
                      error={errors.payment_date}
                      touched={touched.payment_date}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Cash / Checques / DD / Credit Card No."
                      name="card_number"
                      error={errors.card_number}
                      touched={touched.card_number}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      type="number"
                      label="Amount"
                      name="amount"
                      error={errors.amount}
                      touched={touched.amount}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Bank Name"
                      name="bank_name"
                      error={errors.bank_name}
                      touched={touched.bank_name}
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Branch Name"
                      name="branch_name"
                      error={errors.branch_name}
                      touched={touched.branch_name}
                    />
                  </Col>
                </Row>
                <div className="text-center">
                  <Button.Ripple color="primary" outline type="submit">
                    {id ? "Save" : "Add"}
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
