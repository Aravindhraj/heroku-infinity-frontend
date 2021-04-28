import React, { useState, useEffect } from "react";
import { getQuotation } from "../../services/quotations.service";
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    CardBody,
    Row,
    Col,
    FormGroup,
    Label,
} from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { InputField } from "../../components/form-fields/input-field";
import { yupFieldSchema } from "../../helper/formik.helper";
import { saveQuotation } from "../../services/quotations.service";
import { Link } from "react-router-dom";
import { ReactSelectField } from "../../components/form-fields/react-select-field";
import { fetchActiveProducts } from "../../services/product.service";
import { fetchUsersByType } from "../../services/users.service";
import { getAccessories } from "../../services/accessories.service"



const initials = {
    id: "",
    name: "",
    phone: "",
    address: "",
    product_id: "",
    accessories: [],
    old_vehicle_name: "",
    old_vehicle_cost: "",
    sales_person: "",
};



const formSchema = Yup.object().shape({
    name: yupFieldSchema("Name", "string", true),
    phone: yupFieldSchema("Phone", "number", true, 1),
    // product: Yup.string().required("Select Product"),
    accessories: yupFieldSchema("Accessories", "string", true),
    sales_person: Yup.string().required("Select Sales Person")
});


const ProductAdd = ({ match, history }) => {

    const [products, setProducts] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [salesPersons, setSalesPersons] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchAccessories();
        fetchSalesPersons();
    }, []);

    const fetchProducts = async () => {
        const products_data = await fetchActiveProducts();
        setProducts(products_data);
    };

    const fetchAccessories = async () => {
        const accessories_data = await getAccessories();
        setAccessories(accessories_data);
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

    const id = match.params.id;
    const [initialValues, setInitialValues] = useState(initials);
    useEffect(() => {
        if (id) {
            getQuotationData();
        }
    }, []);

    const getQuotationData = async () => {
        const res = await getQuotation(id);

        console.log("res");
        console.log(res.data);

        if (res["id"]) {
            const temp_quotation_data = res;
            // const tempInitials = { ...initialValues };
            // Object.keys(tempInitials).forEach((fieldName) => {
            //     tempInitials[fieldName] = res[fieldName];

            //     console.log(fieldName);
            //     console.log(tempInitials[fieldName]);
            //     console.log(res[fieldName]);
            //     console.log(res["product_data"]);

            // });
            // //   tempInitials["payment_date"] = new Date(tempInitials["payment_date"])
            // //     .toISOString()
            // //     .substr(0, 10);



            // if (res["product_data"]) {
            //     tempInitials["product"] = res["product_data"].name;
            // }

            // setInitialValues(tempInitials);




            if (temp_quotation_data) {

                console.log(temp_quotation_data["product_data"]);
                console.log("temp_quotation_data[product_data]");

                if (temp_quotation_data["product_data"]) {
                    temp_quotation_data["product_id"] = temp_quotation_data["product_data"].id;
                }

                if (temp_quotation_data["sales_person_data"]) {
                    temp_quotation_data["sales_person"] = temp_quotation_data["sales_person_data"];
                    temp_quotation_data["sales_person"].fullname = temp_quotation_data["sales_person"].firstname + " " + temp_quotation_data["sales_person"].lastname;
                }

                setInitialValues(temp_quotation_data);

            } else {
                history.push("../quotations");
            }




        }
    };

    const submitHandler = async (values) => {
        const fData = new FormData();
        Object.keys(values).forEach((fieldName) => {


            if (fieldName == "product") {
                fData.append("product_id", values[fieldName].id)
            } else if (fieldName === "sales_person") {
                fData.append(fieldName, JSON.stringify(values[fieldName]));
            } else
                fData.append(fieldName, values[fieldName]);

        });
        const response = await saveQuotation(fData);
        if (response === "success") {
            history.push("/quotations");
        }
    };
    return (
        <div className={`data-list thumb-view`}>
            <Card>
                <CardHeader>
                    <CardTitle>{`${id ? "Edit" : "Add New"} Quotation`}</CardTitle>
                    <Button.Ripple
                        color="danger"
                        type="button"
                        tag={Link}
                        to="/quotations"
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
                                            type="number"
                                            label="Phone"
                                            name="phone"
                                            error={errors.phone}
                                            touched={touched.phone}
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
                                        <ReactSelectField
                                            isMulti
                                            label="Accessories"
                                            options={accessories}
                                            name="accessories"
                                            selected={values.accessories}
                                            error={errors.accessories}
                                            touched={touched.accessories}
                                            setFieldValue={setFieldValue}
                                            labelKey="name"
                                            valueKey="id"
                                        />
                                    </Col>
                                    <Col>
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
                                    <Col md={6}>
                                        <InputField
                                            label="Old Vehicle Name"
                                            name="old_vehicle_name"
                                            error={errors.old_vehicle_name}
                                            touched={touched.old_vehicle_name}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <InputField
                                            label="Old Vehicle Cost"
                                            name="old_vehicle_cost"
                                            error={errors.old_vehicle_cost}
                                            touched={touched.old_vehicle_cost}
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
