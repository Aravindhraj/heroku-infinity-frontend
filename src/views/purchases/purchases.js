import React, { useEffect, useState } from "react";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";
import { Card, CardTitle, Button, CardBody, CardHeader } from "reactstrap";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import { permissions, scopes } from "../../configs/permissionsConfig";
import { isAllowed } from "../../helper/general.helper";
import { getAllPurchases, getPurchasesByCustomerId } from "../../services/purchases.service";

import * as moment from "moment";

import { store } from "../../redux/storeConfig/store";

const Service = ({ match }) => {
  const user = store.getState().auth.user;

  const [purchases, setPurchases] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
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
      name: "Purchase Number",
      sortable: true,
      selector: "purchase_number",
    },
    {
      name: "Product Name",
      sortable: true,
      selector: "product_data.name",
      cell: (item) => (
        <span>
          {item.product_data["name"]} {item.product_data["varients"]["name"]}
        </span>
      ),
    },
    {
      name: "Purchase Date",
      selector: "purchase_date",
      sortable: true,
      cell: (item) => moment(item.purchase_date).format("D MMM, YYYY"),
    },
    {
      name: "Sales Person",
      selector: "sales_person",
      sortable: true,
      cell: (item) =>
        <span>{item.sales_person_data.firstname} {item.sales_person_data.lastname}
        </span>,
    },
    {
      name: "Customer",
      selector: "customer_data",
      sortable: true,
      cell: (item) =>
        <span>
          {item.customer_data.firstname} {item.customer_data.lastname}
        </span>,
    },
    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) =>
        isAllowed(permissions.sales_lead, scopes.edit) ? (
          <div className="data-list-action">
            <Link to={`${match.path}/${item.id}`}>
              <Edit className="cursor-pointer mr-1" size={20} />
            </Link>
          </div>
        ) : (
            ""
          ),
    },
  ];


  
  useEffect(() => {

    if (user.role.name !== 'Customer') {
      fetchAllPurchases();
    }
    else {
      fetchPurchasesByCustomerId(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateData]);



  const fetchAllPurchases = async () => {
    const purchases = await getAllPurchases(paginateData);
    setPurchases(purchases);
    if (purchases) {
      setTotalRecords(purchases.length);
    }
    console.log("purchases");
    console.log(purchases);
  };

  const fetchPurchasesByCustomerId = async (cust_id) => {
    const purchases = await getPurchasesByCustomerId(paginateData, cust_id);
    setPurchases(purchases);
    if (purchases) {
      setTotalRecords(purchases.length);
    }
  };

  return (
    <div><Card>
      <CardHeader>
        <CardTitle>Purchases</CardTitle>
        {isAllowed(permissions.sales_lead, scopes.create) ? (
          <div className="insurance-add-btn">
            <Button.Ripple
              tag={Link}
              to={`${match.path}/add`}
              className="mr-1"
              color="primary"
              outline
            >
              Add Purchase
            </Button.Ripple>
          </div>
        ) : (
            ""
          )}
      </CardHeader>
      <CardBody>
        <DatatableServer
          data={purchases}
          columns={columns}
          totalRows={totalRecords}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
      </CardBody>
    </Card >


        </div >
  );
};

export default Service;
