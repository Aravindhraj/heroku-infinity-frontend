import React, { useState, useEffect } from "react";
import { getAllQuotations, deleteQuotation } from "../../services/quotations.service";
import { Card, CardHeader, CardTitle, Button, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { Edit, Eye, Printer, Trash } from "react-feather";
import SweetAlert from "react-bootstrap-sweetalert";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import "../../assets/scss/pages/invoice.scss";


import { isAllowed } from "../../helper/general.helper";
import { permissions, scopes } from "../../configs/permissionsConfig";

const Quotations = ({ match }) => {
  const [quotations, setQuotations] = useState([]);
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
    // {
    //   name: "#",
    //   sortable: false,
    //   selector: "id",
    // },
    {
      name: "Quotation Number",
      selector: "quotation_number",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: "name",
      sortable: true,
    },
    {
        name: "Product Name",
        sortable: true,
        selector: "product_data",
        cell: (item) => (
          <span>
            {item.product_data["name"]} {item.product_data["varients"]["name"]}
          </span>
        ),
      },
      
    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) => (
        <div className="data-list-action">
          {isAllowed(permissions.quotations, scopes.edit) ? (
            <Link to={`${match.path}/${item.id}`}>
              <Edit className="cursor-pointer mr-1" size={20} />
            </Link>
          ) : (
            ""
          )}

          {isAllowed(permissions.quotations, scopes.delete) ? (
            <Link to="#" onClick={() => showDeleteAlert(item.id)}>
              <Trash className="cursor-pointer mr-1" size={20} />
            </Link>
          ) : (
            ""
          )}
          {/* <Link to={`/quotations/print`} target='_blank'>
            <Printer className="cursor-pointer mr-1" size={20} />
          </Link> 
           <Link to={`${match.path}/preview/${item.id}`}>
            <Eye className="cursor-pointer mr-1" size={20} />
          </Link>*/}

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
    getQuotationsData();
  }, [paginateData]);

  const getQuotationsData = async () => {
    const data = await getAllQuotations(paginateData);
    if (data.records !== undefined && data.total !== undefined) {
      setQuotations(data.records);
      setTotal(data.total);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShowAlert(false);
  };

  const onConfirm = async () => {
    const res = await deleteQuotation(deleteId);
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
          <CardTitle>Quotations</CardTitle>
          {isAllowed(permissions.quotations, scopes.create) ? (
            <div className="user-add-btn">
              <Button.Ripple
                className="mr-1"
                color="primary"
                tag={Link}
                to={`${match.path}/add`}
                outline
              >
                Add Quotation
              </Button.Ripple>
            </div>
          ) : (
            ""
          )}
        </CardHeader>
        <CardBody>
          <DatatableServer
            data={quotations}
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
        <QuotationPrint {...printItem} />
      </div> */}
    </>
  );
};

export default Quotations;
