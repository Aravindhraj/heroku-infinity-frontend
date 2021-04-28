import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../services/general-table.service";
import GeneralListing from "../general/general-listing";

const SpareParts = () => {
  return (
    <GeneralListing
      title="Spare Parts"
      recordType="Spare Part"
      getRecords={() => getRecords("table/spare-parts")}
      deleteRecord={(id) => deleteRecord("table/spare-parts", id)}
      saveRecord={(data) => saveRecord("table/spare-parts", data)}
    />
  );
};

export default SpareParts;
