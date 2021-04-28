// ** Third Party Components
import React from "react";
import { Card, CardBody, CardText, Row, Col, Table, Media } from 'reactstrap';
import logo from "../../assets/img/logo/tvs-vector-logo.png";
import { Mail, Phone } from "react-feather";


const PreviewCard = ({ data }) => {

  const discount = Math.round(data.product_data.total_sales_price/20);
  const final_price = Math.round(data.product_data.total_sales_price - data.product_data.total_sales_price/20);
  return data !== null ? (
    <Card className='invoice-preview-card'>
      <CardBody className='invoice-padding pb-0'>
        {/* Header */}
        <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
          <div>
            <div>
              <Media className="pt-1">
                <img src={logo} alt="logo" height="70px" width="70px" />
              </Media>
              {/* <h3 className='text-primary invoice-logo'>RK TVS</h3> */}

            </div>
            <CardText><strong><h2>R.K MOTORS</h2></strong></CardText>

            <CardText className='mb-25'>T.C.T.J Building , 73M,</CardText>
            <CardText className='mb-25'>Thadikombu Road, DINDIGUL - 624001</CardText>
            <CardText className='mb-0'><Phone size={15} className="mr-50" />+91 7397790001, +91 7397790002</CardText>
            <CardText className='mb-0'><Mail size={15} className="mr-50" />rktvsdgl@gmail.com</CardText>
          </div>
          <div className='mt-md-0 mt-2'>
            <h4 className='invoice-title'>
              Quotation: <span className='invoice-number'>#{data.quotation_number}</span>
            </h4>
            {/* <div className='invoice-date-wrapper'>
              <p className='invoice-date-title'>Date Issued:</p>
              <p className='invoice-date'>{data.createdAt}</p>
            </div> */}
            {/* <div className='invoice-date-wrapper'>
              <p className='invoice-date-title'>Due Date:</p>
              <p className='invoice-date'>{data.invoice.dueDate}</p>
            </div> */}
          </div>
        </div>
        {/* /Header */}
      </CardBody>

      <hr className='invoice-spacing' />

      {/* Address and Contact */}
      <CardBody className='invoice-padding pt-0'>
        <Row className='invoice-spacing'>
          <Col className='p-0' lg='8'>
            <h6 className='mb-2'>To:</h6>
            <h6 className='mb-25'>{data.name}</h6>
            <CardText className='mb-25'>{data.address}</CardText>
            <CardText className='mb-25'>{data.phone}</CardText>
            {/* <CardText className='mb-0'>{data.invoice.client.companyEmail}</CardText> */}
          </Col>
          {/* <Col className='p-0 mt-xl-0 mt-2' lg='4'>
            <h6 className='mb-2'>Payment Details:</h6>
            <table>
              <tbody>
                <tr>
                  <td className='pr-1'>Total Due:</td>
                  <td>
                    <span className='font-weight-bolder'></span>
                  </td>
                </tr>
                <tr>
                  <td className='pr-1'>Bank name:</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='pr-1'>Country:</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='pr-1'>IBAN:</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='pr-1'>SWIFT code:</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </Col> */}
        </Row>
      </CardBody>
      {/* /Address and Contact */}

      {/* Invoice Description */}
      <Table responsive>
        <thead>
          <tr>
            <th className='py-1'>Item</th>
            {/* <th className='py-1'>Rate</th>
            <th className='py-1'>Hours</th> */}
            <th className='py-1'>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='py-1'>
            <p className='card-text font-weight-bold mb-25'>{data.product_data.name} {data.product_data.varients.name}</p>
            </td>
            {/* <td className='py-1'>
              <span className='font-weight-bold'>$60.00</span>
            </td>
            <td className='py-1'>
              <span className='font-weight-bold'>30</span>
            </td> */}
            <td className='py-1'>
              <span className='font-weight-bold'>{data.product_data.vehicle_cost} INR</span>
            </td>
          </tr>
          <tr className='border-bottom'>
            <td className='py-1'>
              <p className='card-text text-nowrap'>Insurance Cost</p>
            </td>
            <td className='py-1'>
              <span className='font-weight-bold'>{data.product_data.insurance_cost} INR</span>
            </td>
          </tr>
          <tr>
            <td className='py-1'>
              <p className='card-text text-nowrap'>Registration Cost</p>
            </td>
            <td className='py-1'>
              <span className='font-weight-bold'>{data.product_data.reg_handling_cost} INR</span>
            </td>
          </tr>
          <tr >
            <td className='py-1'>
              <p className='card-text text-nowrap'>Road Tax</p>
            </td>
            <td className='py-1'>
              <span className='font-weight-bold'>{data.product_data.road_tax_cost} INR</span>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* /Invoice Description */}

      {/* Total & Sales Person */}
      <CardBody className='invoice-padding pb-0'>
        <Row className='invoice-sales-total-wrapper'>
          <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
            <CardText className='mb-0'>
              <span className='font-weight-bold'>Salesperson:</span> <span className='ml-75'>{data.sales_person_data.firstname} {data.sales_person_data.lastname}</span>
            </CardText>
          </Col>
          <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
            <div className='invoice-total-wrapper'>
              <div className='invoice-total-item'>
                <p className='invoice-total-title'>Subtotal:</p>
                <p className='invoice-total-amount'>{data.product_data.total_sales_price} INR</p>
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
      </CardBody>
      {/* /Total & Sales Person */}

      <hr className='invoice-spacing' />

      {/* Invoice Note */}
      <CardBody className='invoice-padding pt-0'>
        <Row>
          <Col sm='12'>
            <span className='font-weight-bold'>Note: </span>
            <span>
             1. Insurance covered is only for the Basic Vehicle Cost.
             2. This Price quoted above are subject to change without notice and those ruling on degiof delivery alone will be applicable.
             3. This is not an order and no claim for priority can be made on the basis of this quotation.
             4. The company will not be hold responsible for allotment of registration numbers at the RTO's office.
             5. Customers must bring the following address proofs for the registration purpose: Ration card Xerox (or) LIC Bond Xerox (or) Election ID Card and Photos-5 (or) Passport Xerox
            </span>
          </Col>
        </Row>
      </CardBody>
      {/* /Invoice Note */}
    </Card>
  ) : null
}

export default PreviewCard
