import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const LeadCategories = () => {
  return (
    <GeneralListing
      title="Lead Categoires"
      recordType="Lead Category"
      getRecords={() => getRecords("table/lead-categories")}
      deleteRecord={(id) => deleteRecord("table/lead-categories", id)}
      saveRecord={(data) => saveRecord("table/lead-categories", data)}
    />
  );
};

export default LeadCategories;
