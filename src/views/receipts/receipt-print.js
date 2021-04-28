// ** React Imports
import React from "react";
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// ** Third Party Components

import { getReceipt } from '../../services/receipts.service'


// ** Styles
import '../quotations/app-invoice-print.scss'
import PrintReceipt from "./PrintReceipt";

const ReceiptPrint = ({ match }) => {

  const { id } = useParams();
  const [data, setData] = useState(null);

  // ** QuotationPrint on mount
  useEffect(() => {
    getReceiptData();

  }, [])

  const getReceiptData = async () => {
    const res = await getReceipt(id);
    setData(res);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return data !== null && data.id !== undefined ? (
    <PrintReceipt data={data} />
  ) : (
      null
    )
}

export default ReceiptPrint
