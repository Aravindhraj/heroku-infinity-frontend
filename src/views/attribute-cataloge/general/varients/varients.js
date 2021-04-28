import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const Varients = () => {
  return (
    <GeneralListing
      title="Varients"
      recordType="Varient"
      getRecords={() => getRecords("table/varients")}
      deleteRecord={(id) => deleteRecord("table/varients", id)}
      saveRecord={(data) => saveRecord("table/varients", data)}
    />
  );
};

export default Varients;
