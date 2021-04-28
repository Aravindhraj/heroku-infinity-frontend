import React, { useEffect, useState } from "react";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";
import { Card, CardTitle, Button, CardBody, CardHeader } from "reactstrap";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import { permissions, scopes } from "../../configs/permissionsConfig";
import { isAllowed } from "../../helper/general.helper";
import { getAllLeads } from "../../services/sales-lead.service";

const SalesLeadList = ({ match }) => {
  const [leads, setLeads] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
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
      sortable: true,
      selector: "full_name",
      // cell: (item) => (
      //   <span>
      //     {item.product_data["name"]} {item.product_data["varients"]["name"]}
      //   </span>
      // ),
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
      name: "Lead Type",
      selector: "lead_type",
      sortable: true,
      cell: (item) => <span>{item.lead_type}</span>,
    },
    {
      name: "Lead Category",
      selector: "lead_category",
      sortable: true,
      cell: (item) => <span>{item.lead_category}</span>,
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
    fetchAllLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateData]);

  const fetchAllLeads = async () => {
    const leads = await getAllLeads(paginateData);
    setLeads(leads);
    if (leads) {
      setTotalRecords(leads.length);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Leads</CardTitle>
        {isAllowed(permissions.sales_lead, scopes.create) ? (
          <div className="insurance-add-btn">
            <Button.Ripple
              tag={Link}
              to={`${match.path}/add`}
              className="mr-1"
              color="primary"
              outline
            >
              Add Sales Lead
            </Button.Ripple>
          </div>
        ) : (
          ""
        )}
      </CardHeader>
      <CardBody>
        <DatatableServer
          data={leads}
          columns={columns}
          totalRows={totalRecords}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
      </CardBody>
    </Card>
  );
};

export default SalesLeadList;
