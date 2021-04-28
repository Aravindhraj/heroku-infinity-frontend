import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const LeadTypes = () => {
  return (
    <GeneralListing
      title="Lead Types"
      recordType="Lead Type"
      getRecords={() => getRecords("table/lead-types")}
      deleteRecord={(id) => deleteRecord("table/lead-types", id)}
      saveRecord={(data) => saveRecord("table/lead-types", data)}
    />
  );
};

export default LeadTypes;
