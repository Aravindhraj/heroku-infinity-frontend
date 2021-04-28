// ** Third Party Components
import React from "react";
import { Row, Col, Table, Media } from 'reactstrap';
import { Link } from 'react-router-dom'

import tvsLogo from "../../assets/img/logo/tvs-vector-logo.png";
import { Mail, Phone } from "react-feather";
import { Alert } from 'reactstrap'


const PrintCard = ({ data }) => {
    const discount = Math.round(data.product_data.total_sales_price / 20);
    console.log(data);
    const sub_total = Math.round(data.product_data.vehicle_cost + data.product_data.insurance_cost + data.product_data.reg_handling_cost + data.product_data.road_tax_cost + data.accessories_total_price - data.old_vehicle_cost);
    const final_price = sub_total - discount;
    return data !== null ? (<div className='invoice-print p-3'>
        <div className='d-flex justify-content-between flex-md-row flex-column pb-2'>
            <div>
                <div className='d-flex mb-1'>
                    <Media className="pt-1">
                        <img src={tvsLogo} alt="logo" height="70px" width="70px" />
                    </Media>
                </div>
                <strong><h2>R.K MOTORS</h2></strong>
                <p className='mb-25'>T.C.T.J Building , 73M,</p>
                <p className='mb-0'>Thadikombu Road, DINDIGUL - 624001</p>
                <p className='mb-0'><Phone size={15} className="mr-50" />+91 7397790001, +91 7397790002</p>
                <p className='mb-0'><Mail size={15} className="mr-50" />rktvsdgl@gmail.com</p>
            </div>
            <div className='mt-md-0 mt-2'>
                <h4 className='font-weight-bold text-right mb-1'>
                    Quotation: <span className='invoice-number'>#{data.quotation_number}</span>
                </h4>
            </div>
        </div>

        <hr className='my-2' />

        <Row className='pb-2'>
            <Col sm='6'>
                <h6 className='mb-1'>To:</h6>
                <p className='mb-25'>{data.name}</p>
                <p className='mb-25'>{data.address}</p>
                <p className='mb-25'>{data.phone}</p>
            </Col>
        </Row>

        <Table className='mt-2 mb-0' responsive>
            <thead>
                <tr>
                    <th className='py-1 pl-4'>Item</th>
                    <th className='py-1'>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr className="no-border"><td>&nbsp;</td></tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                    <strong>{data.product_data.name} {data.product_data.varients.name}</strong>

                    </td>
                    <td className='py-1'>
                        <strong>{data.product_data.vehicle_cost} INR</strong>
                    </td>
                </tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Insurance Cost</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.product_data.insurance_cost} INR</strong>
                    </td>
                </tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Registration Cost</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.product_data.reg_handling_cost} INR</strong>
                    </td>
                </tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Road Tax</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.product_data.road_tax_cost} INR</strong>
                    </td>
                </tr>

                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-bold mb-25'>Accessories:</p>
                    </td>
                </tr>

                {data.accessories_data.map((item, index) => (

                    <tr className="no-border">
                        <td className='py-1 pl-4'>
                            <p className='font-weight-semibold mb-25'>{item.name}</p>
                        </td>
                        <td className='py-1'>
                            <strong>{item.price} INR</strong>
                        </td>
                    </tr>
                ))};
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-bold mb-25'>Old Vehicle Details:</p>
                    </td>
                </tr>

                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>{data.old_vehicle_name}</p>
                    </td>
                    <td className='py-1'>
                        <strong>- {data.old_vehicle_cost} INR</strong>
                    </td>
                </tr>
            </tbody>
        </Table>  <hr className='my-2' />


        <Row className='invoice-sales-total-wrapper mt-3'>
            <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
                <p className='mb-0'>
                    <span className='font-weight-bold'>Salesperson:</span> <span className='ml-75'>{data.sales_person_data.firstname} {data.sales_person_data.lastname}</span>
                </p>
            </Col>
            <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
                <div className='invoice-total-wrapper'>
                    <div className='invoice-total-item'>
                        <p className='invoice-total-title'>Subtotal:</p>
                        <p className='invoice-total-amount'>{sub_total} INR</p>
                    </div>
                    <div className='invoice-total-item'>
                        <p className='invoice-total-title'>Discount:</p>
                        <p className='invoice-total-amount'>{discount} INR</p>
                    </div>

                    <hr className='my-50' />
                    <div className='invoice-total-item'>
                        <p className='invoice-total-title'>Total:</p>
                        <p className='invoice-total-amount'>{final_price} INR</p>
                    </div>
                </div>
            </Col>
        </Row>

        <hr className='my-2' />

        <Row>
            <Col sm='12'>
                <span className='font-weight-bold'>Note:<br /></span>
                <span>
                    1. Insurance covered is only for the Basic Vehicle Cost.<br />
                    2. This Price quoted above are subject to change without notice and those ruling on degiof delivery alone will be applicable.<br />
                    3. This is not an order and no claim for priority can be made on the basis of this quotation.<br />
                    4. The company will not be hold responsible for allotment of registration numbers at the RTO's office.<br />
                    5. Customers must bring the following address proofs for the registration purpose: Ration card Xerox (or) LIC Bond Xerox (or) Election ID Card and Photos-5 (or) Passport Xerox<br />
                </span>
            </Col>
        </Row>
    </div>) : (
            <Alert color='danger'>
                <h4 className='alert-heading'>Invoice not found</h4>
                <div className='alert-body'>
                    Quotation doesn't exist. Check list of all invoices: <Link to='/quotations/'>Quotation List</Link>
                </div>
            </Alert>
        )
}

export default PrintCard
