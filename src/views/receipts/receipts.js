import React, { useState, useEffect } from "react";
import { getReceipts, deleteReceipt } from "../../services/receipts.service";
import { Card, CardHeader, CardTitle, Button, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { Edit, Printer, Trash } from "react-feather";
import SweetAlert from "react-bootstrap-sweetalert";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import "../../assets/scss/pages/invoice.scss";
import "./receipt.scss";

import * as moment from "moment";
import { isAllowed } from "../../helper/general.helper";
import { permissions, scopes } from "../../configs/permissionsConfig";

const Receipts = ({ match }) => {
  const [receipts, setReceipts] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [printItem, setPrintItem] = useState({});
  const [paginateData, setPaginateData] = useState({
    start: 1,
    perPage: 10,
    sortBy: "id",
    sortMode: "asc",
    search: "",
  });

  const columns = [
    {
      name: "#",
      sortable: false,
      selector: "id",
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Amount",
      selector: "amount",
      sortable: true,
      cell: (item) => item.amount + " INR",
    },
    {
      name: "Payment Date",
      selector: "createdAt",
      sortable: true,
      cell: (item) => moment(item.payment_date).format("MMMM D, YYYY"),
    },
    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) => (
        <div className="data-list-action">
          {isAllowed(permissions.receipt, scopes.edit) ? (
            <Link to={`${match.path}/${item.id}`}>
              <Edit className="cursor-pointer mr-1" size={20} />
            </Link>
          ) : (
            ""
          )}

          {isAllowed(permissions.receipt, scopes.delete) ? (
            <Link to="#" onClick={() => showDeleteAlert(item.id)}>
              <Trash className="cursor-pointer mr-1" size={20} />
            </Link>
          ) : (
            ""
          )}
          {/* <Link to="#" onClick={() => printDetails(item)}>
            <Printer className="cursor-pointer mr-1" size={20} />
          </Link> */}

          <Link
          color='secondary'
          tag={Link}
          to={`${match.path}/print/${item.id}`}
          target='_blank'
          className='mb-75'
        ><Printer className="cursor-pointer mr-1" /></Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getReceiptsData();
  }, [paginateData]);

  const getReceiptsData = async () => {
    const data = await getReceipts(paginateData);
    if (data.records !== undefined && data.total !== undefined) {
      setReceipts(data.records);
      setTotal(data.total);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShowAlert(false);
  };

  const onConfirm = async () => {
    const res = await deleteReceipt(deleteId);
    if (res && res["success"]) {
      setPaginateData({ ...paginateData, start: 1 });
      setDeleteId(null);
      setShowAlert(false);
    }
  };
  const showDeleteAlert = (id) => {
    if (id) {
      setDeleteId(id);
      setShowAlert(true);
    }
  };

  const printDetails = (item) => {
    setPrintItem(item);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <>
      <Card id="table-card">
        <CardHeader>
          <CardTitle>Receipts</CardTitle>
          {isAllowed(permissions.receipt, scopes.create) ? (
            <div className="user-add-btn">
              <Button.Ripple
                className="mr-1"
                color="primary"
                tag={Link}
                to={`${match.path}/add`}
                outline
              >
                Add Receipt
              </Button.Ripple>
            </div>
          ) : (
            ""
          )}
        </CardHeader>
        <CardBody>
          <DatatableServer
            data={receipts}
            columns={columns}
            totalRows={total}
            paginateData={paginateData}
            setPaginateData={setPaginateData}
          />
        </CardBody>
      </Card>
      <SweetAlert
        warning
        showCancel
        reverseButtons
        show={showAlert}
        title={"Are You Sure?"}
        onConfirm={onConfirm}
        onCancel={onCancel}
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
      >
        You won't be able to revert this!
      </SweetAlert>
      {/* <div id="print_table">
        <PrintReceipt {...printItem} />
      </div> */}
      {/* <div id="print_table" style={{ opacity: 0, position: "absolute" }}> */}
    </>
  );
};

export default Receipts;
