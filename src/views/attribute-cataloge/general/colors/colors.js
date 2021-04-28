import React from "react";
import {
  deleteRecord,
  getRecords,
  saveRecord,
} from "../../../../services/general-table.service";
import GeneralListing from "../general-listing";

const Colors = () => {
  return (
    <GeneralListing
      title="Colors"
      recordType="Color"
      getRecords={() => getRecords("table/colors")}
      deleteRecord={(id) => deleteRecord("table/colors", id)}
      saveRecord={(data) => saveRecord("table/colors", data)}
    />
  );
};

export default Colors;
