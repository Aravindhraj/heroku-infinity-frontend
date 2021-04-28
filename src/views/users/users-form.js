import React, { useState, useEffect } from "react";
import {
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { history } from "./../../history";
import { getUser, saveUser } from "../../services/users.service";
import { getRoles } from "../../services/role-permission.service";
import { getActiveDepartments } from "../../services/department.service";
import { setErrorObject, setNullToEmpty } from "./../../helper/formik.helper";
import { ReactSelectField } from "../../components/form-fields/react-select-field";

const schemaObj = {
  firstname: Yup.string().required("Enter Firstname"),
  lastname: Yup.string().required("Enter Lastname"),
  email: Yup.string().email("Enter Valid Email").required("Enter Email"),
  role: Yup.number().required("Select Role"),
  department_id: Yup.number().required("Select Department"),
  mobile: Yup.string().nullable(),
  age: Yup.number().min(0).nullable(),
  address: Yup.string().nullable(),
  proof_type: Yup.string().nullable(),
  proof_no: Yup.string().nullable(),
  status: Yup.boolean(),
};

const UserForm = ({ match }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [action, setAction] = useState("add");
  const [formSchema, setFormSchema] = useState(null);

  useEffect(() => {
    if (action !== "edit") {
      schemaObj["password"] = Yup.string().required("Enter Password").min(6);
      schemaObj["confirm_password"] = Yup.string()
        .required("Enter Confirm Password")
        .oneOf([Yup.ref("password"), null], "Both Passwords Must Match");
      setFormSchema(Yup.object().shape(schemaObj));
    } else {
      if (schemaObj["password"]) delete schemaObj["password"];
      if (schemaObj["confirm_password"]) delete schemaObj["confirm_password"];

      setFormSchema(Yup.object().shape(schemaObj));
    }
  }, [action]);

  useEffect(() => {
    const fetchUser = async () => {
      if (match.params.id) {
        const temp_user = await getUser(match.params.id);
        if (temp_user) {
          setUser(temp_user);
          setAction("edit");
        } else {
          history.push("../users");
        }
      }
    };
    fetchUser();
  }, [match.params.id]);

  useEffect(() => {
    const fetchRolesAndDept = async () => {
      const temp_roles = await getRoles();
      setRoles(temp_roles);
      const temp_dept = await getActiveDepartments();
      setDepartments(temp_dept);
    };
    fetchRolesAndDept();
  }, []);

  const submitForm = async (data, setErrors) => {
    const response = await saveUser(data);
    if (response["success"]) {
      history.push("../users");
    } else {
      setErrors(setErrorObject(response["errors"]));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action === "add" ? "Add User" : "Edit User"}</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            id: user ? user["id"] : "",
            firstname: user ? user["firstname"] : "",
            lastname: user ? user["lastname"] : "",
            email: user ? user["email"] : "",
            address: user ? setNullToEmpty(user["address"]) : "",
            age: user ? setNullToEmpty(user["age"]) : "",
            mobile: user ? setNullToEmpty(user["mobile"]) : "",
            proof_type: user
              ? user["proof_type"] === "" || user["proof_type"] === null
                ? "AADHAR"
                : user["proof_type"]
              : "AADHAR",
            proof_no: user ? setNullToEmpty(user["proof_no"]) : "",
            status: user ? user["status"] : true,
            password: "",
            confirm_password: "",
            role:
              roles.length > 0 && !user
                ? roles[0]["id"]
                : user
                ? user["roles"][0]["id"]
                : 0,
            department_id: user ? user["department_id"] : "",
          }}
          enableReinitialize={true}
          validationSchema={formSchema}
          onSubmit={(data, { setErrors }) => submitForm(data, setErrors)}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
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
                  <FormGroup className="">
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
                  <FormGroup className="">
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
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="mobile">Mobile</Label>
                    <Field
                      type="text"
                      name="mobile"
                      id="mobile"
                      className={`form-control ${
                        errors.mobile && touched.mobile && "is-invalid"
                      }`}
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <ReactSelectField
                      label="Role"
                      options={roles}
                      name="role"
                      selected={values.role}
                      error={errors.role}
                      touched={touched.role}
                      setFieldValue={setFieldValue}
                      labelKey="name"
                      valueKey="id"
                    />
                    {/* <Label for="role">Role</Label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className={`form-control ${
                        errors.role && touched.role && "is-invalid"
                      }`}
                    >
                      <option selected disabled value="">
                        Select Role
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role["name"]}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="field-error text-danger"
                    /> */}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <ReactSelectField
                      label="Department"
                      options={departments}
                      name="department_id"
                      selected={values.department_id}
                      error={errors.department_id}
                      touched={touched.department_id}
                      setFieldValue={setFieldValue}
                      labelKey="name"
                      valueKey="id"
                    />
                    {/* <Label for="role">Department</Label>
                    <Field
                      as="select"
                      id="department_id"
                      name="department_id"
                      className={`form-control ${
                        errors.department_id &&
                        touched.department_id &&
                        "is-invalid"
                      }`}
                      value=""
                    >
                      <option selected disabled>
                        Select Department
                      </option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department["name"]}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="department_id"
                      component="div"
                      className="field-error text-danger"
                    /> */}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup className="">
                    <Label for="address">Address</Label>
                    <Field
                      type="text"
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
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="age">Age</Label>
                    <Field
                      type="number"
                      name="age"
                      id="age"
                      min={0}
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
                  <FormGroup className="">
                    <Label for="status">Status</Label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className={`form-control ${
                        errors.status && touched.status && "is-invalid"
                      }`}
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
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="proof_type">Proof Type</Label>
                    <Field
                      as="select"
                      id="proof_type"
                      name="proof_type"
                      className={`form-control ${
                        errors.proof_type && touched.proof_type && "is-invalid"
                      }`}
                    >
                      <option value="AADHAR">Aadhar Card</option>
                      <option value="PAN">Pan Card</option>
                    </Field>
                    <ErrorMessage
                      name="proof_type"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="proof_no">Proof No</Label>
                    <Field
                      type="text"
                      id="proof_no"
                      name="proof_no"
                      className={`form-control ${
                        errors.proof_no && touched.proof_no && "is-invalid"
                      }`}
                    />
                    <ErrorMessage
                      name="proof_no"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="password">Password</Label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className={`form-control ${
                        errors.password && touched.password && "is-invalid"
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="field-error text-danger"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="">
                    <Label for="confirm_password">Confirm Password</Label>
                    <Field
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      className={`form-control ${
                        errors.confirm_password &&
                        touched.confirm_password &&
                        "is-invalid"
                      }`}
                    />
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      className="field-error text-danger"
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
  );
};

export default UserForm;
