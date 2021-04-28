import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const EnquiryTypes = () => {
  return (
    <GeneralListing
      title="Enquiry Types"
      recordType="Enquiry Type"
      getRecords={() => getRecords("table/enquiry-types")}
      deleteRecord={(id) => deleteRecord("table/enquiry-types", id)}
      saveRecord={(data) => saveRecord("table/enquiry-types", data)}
    />
  );
};

export default EnquiryTypes;
