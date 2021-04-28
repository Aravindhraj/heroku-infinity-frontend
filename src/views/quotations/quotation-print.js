// ** React Imports
import React from "react";
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// ** Third Party Components

import { getQuotation } from '../../services/quotations.service'


// ** Styles
import './app-invoice-print.scss'
import PrintCard from "./PrintCard";

const QuotationPrint = ({ match }) => {

  const { id } = useParams();
  const [data, setData] = useState(null);

  // ** QuotationPrint on mount
  useEffect(() => {
    getQuotationData();
    
  }, [])

  const getQuotationData = async () => {
    const res = await getQuotation(id);
    setData(res);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return data !== null && data.id !== undefined ? (
    <PrintCard data={data}/>
  ) : (
      null
    )
}

export default QuotationPrint
