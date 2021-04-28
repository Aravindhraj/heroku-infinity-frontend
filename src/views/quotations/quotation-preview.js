import React from "react";
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Third Party Components
import { Row, Col, Alert } from 'reactstrap'

// ** Invoice Preview Components
import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'
import {getQuotation} from '../../services/quotations.service'
// import SendInvoiceSidebar from '../shared-sidebar/SidebarSendInvoice'
// import AddPaymentSidebar from '../shared-sidebar/SidebarAddPayment'

// ** Styles
import './app-invoice.scss'

const QuotationPreview = () => { 
  // ** Vars
  const { id } = useParams()

  // ** States
  const [data, setData] = useState(null)
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen)
  const toggleAddSidebar = () => setAddPaymentOpen(!addPaymentOpen)

  // ** Get invoice on mount based on id
  useEffect(() => {

    getQuotationData();

    // axios.post("quotations/get", { id }).then(response => {

    //   console.log("response.data.data");
    //   console.log(response.data.data);

    //  const data1 = {invoice:{invoice_number:2}};

    //   setData(data1);
    // })
  }, [])


  const getQuotationData = async () => {
    const res = await getQuotation(id);

    console.log(res);
    setData(res);

    if (res["id"]) {
        const temp_quotation_data = res;
        
        if (temp_quotation_data) {
  
            if (temp_quotation_data["product_data"]) {
              temp_quotation_data["product"] = temp_quotation_data["product_data"];
            }
  
            
          } else {
          }

    }
};


  return data !== null && data.id !== undefined ? (
    <div className='invoice-preview-wrapper'>
      <Row className='invoice-preview'>
        <Col xl={9} md={8} sm={12}>
          <PreviewCard data={data} />
        </Col>
        <Col xl={3} md={4} sm={12}>
          <PreviewActions id={id} setSendSidebarOpen={setSendSidebarOpen} setAddPaymentOpen={setAddPaymentOpen} />
        </Col>
      </Row>
      {/* <SendInvoiceSidebar toggleSidebar={toggleSendSidebar} open={sendSidebarOpen} />
      <AddPaymentSidebar toggleSidebar={toggleAddSidebar} open={addPaymentOpen} /> */}
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Invoice not found</h4>
      <div className='alert-body'>
        Invoice with id: {id} doesn't exist. Check list of all invoices: <Link to='/quotations/'>Quotation List</Link>
      </div>
    </Alert>
  )
}

export default QuotationPreview
