import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const PaymentTypes = () => {
  return (
    <GeneralListing
      title="Payment Types"
      recordType="Payment Type"
      getRecords={() => getRecords("table/payment-types")}
      deleteRecord={(id) => deleteRecord("table/payment-types", id)}
      saveRecord={(data) => saveRecord("table/payment-types", data)}
    />
  );
};

export default PaymentTypes;
