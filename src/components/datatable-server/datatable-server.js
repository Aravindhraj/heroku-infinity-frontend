import React from "react";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import { Search } from "react-feather";

export const DatatableServer = ({
  data,
  columns,
  totalRows,
  paginateData,
  setPaginateData,
}) => {
  const onChangePage = (start) => {
    setPaginateData({ ...paginateData, start });
  };
  const onChangePerPage = (perPage) => {
    setPaginateData({ ...paginateData, perPage });
  };
  const onSort = ({ selector }, sortMode) => {
    setPaginateData({ ...paginateData, sortBy: selector, sortMode, start: 1 });
  };
  return (
    <DataTable
      data={data}
      columns={columns}
      highlightOnHover
      sortServer
      noHeader
      subHeader
      pagination
      paginationServer
      paginationPerPage={paginateData.perPage}
      paginationTotalRows={totalRows}
      paginationDefaultPage={paginateData.defaultPage}
      onSort={onSort}
      onChangeRowsPerPage={onChangePerPage}
      onChangePage={onChangePage}
      subHeaderComponent={
        <div className="d-flex flex-wrap justify-content-between">
          <div className="position-relative has-icon-left mb-1">
            <Input
              value={paginateData.search}
              onChange={({ target: { value } }) =>
                setPaginateData({ ...paginateData, search: value })
              }
            />
            <div className="form-control-position">
              <Search size="15" />
            </div>
          </div>
        </div>
      }
    />
  );
};
