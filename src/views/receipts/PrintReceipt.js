// ** Third Party Components
import React from "react";
import { Row, Col, Table, Media } from 'reactstrap';
import { Link } from 'react-router-dom'

import tvsLogo from "../../assets/img/logo/tvs-vector-logo.png";
import { Mail, Phone } from "react-feather";
import { Alert } from 'reactstrap'
import { amountToWords } from "../../helper/general.helper";
import * as moment from "moment";

const PrintReceipt = ({ data }) => {

    console.log(data);

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
                    Receipt: <span className='invoice-number'>#{data.receipt_number}</span>
                </h4>
            </div>
        </div>

        <hr className='my-2' />

        <Row className='pb-2'>
            <Col sm='6'>
                <h6 className='mb-1'>Receipt To:</h6>
                <p className='mb-25'>{data.name}</p>
                <p className='mb-25'>{data.address}</p>
                <p className='mb-25'>{data.contact}</p>
            </Col>
        </Row>

        <Table className='mt-2 mb-0' responsive>
            {/* <thead>
                <tr>
                    <th className='py-1 pl-4'>Item</th>
                    <th className='py-1'>Total</th>
                </tr>
            </thead> */}
            <tbody>
                <tr>
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Receipient Name</p>

                    </td>
                    <td className='py-1'>
                        <strong>{data.name}</strong>
                    </td>
                </tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Payment Date</p>
                    </td>
                    <td className='py-1'>
                        <strong>{moment(data.payment_date).format("MMMM D, YYYY")}</strong>
                    </td>
                </tr>
                <tr className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Amount</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.amount} INR</strong>
                    </td>
                </tr>
                <tr  className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Amount To Words</p>
                    </td>
                    <td className='py-1'>
                        <strong>{amountToWords(data.amount)} RUPEES</strong>
                    </td>
                </tr>
                <tr  className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Bank Name</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.bank_name}</strong>
                    </td>
                </tr>
                <tr  className="no-border">
                    <td className='py-1 pl-4'>
                        <p className='font-weight-semibold mb-25'>Branch Name</p>
                    </td>
                    <td className='py-1'>
                        <strong>{data.branch_name}</strong>
                    </td>
                </tr>
               
            </tbody>
        </Table> <hr className='my-2' />

<Row></Row>
<Row></Row>
        <Row className='invoice-sales-total-wrapper mt-3'>
            <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
                <p className='mb-0'>
                    <span className='font-weight-bold'>Customer Signature</span>
                </p>
                <p className='mb-0'>
                    <span >Cheque / DD subject to realization</span>
                </p>
            </Col>
            <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
            <p className='mb-0'>
                    <span className='font-weight-bold'>Authorized Signatory</span>
                </p>
            </Col>
        </Row>

        <hr className='my-2' />

    </div>) : (
            <Alert color='danger'>
                <h4 className='alert-heading'>Receipt not found</h4>
                <div className='alert-body'>
                    Receipt doesn't exist. Check list of all invoices: <Link to='/quotations/'>Receipt List</Link>
                </div>
            </Alert>
        )
}

export default PrintReceipt