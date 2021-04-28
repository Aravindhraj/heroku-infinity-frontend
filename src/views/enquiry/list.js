import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, Button, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { Edit, GitMerge } from "react-feather";
import { fetchAll } from "../../services/enquiry.service";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import { isAllowed } from "../../helper/general.helper";
import { permissions, scopes } from "../../configs/permissionsConfig";

const EnquiryList = ({ match }) => {
  const [enquiries, setEnquiries] = useState([]);
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
      selector: "name",
      sortable: true,
      cell: (item) => (
        <span>
          {item.firstname} {item.lastname}
        </span>
      ),
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Product",
      selector: "product.name",
      sortable: true,
    },
    {
      name: "Sales Executive",
      selector: "sales",
      sortable: true,
      cell: (item) => (
        <span>
          {item.sales.firstname} {item.sales.lastname}
        </span>
      ),
    },
    {
      name: "Priority",
      selector: "priority",
      sortable: true,
    },
    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) => (
        <>
          {isAllowed(permissions.enquiry, scopes.edit) ? (
            <div className="data-list-action">
              <Link to={`${match.path}/${item.id}`}>
                <Edit className="cursor-pointer mr-1" size={20} />
              </Link>
            </div>
          ) : (
            " "
          )}
          {!item.converted_to_sales &&
          isAllowed(permissions.sales_lead, scopes.create) ? (
            <Link to={`sales/add?cts=${item.id}`}>
              <GitMerge className="cursor-pointer mr-1" size={20}></GitMerge>
            </Link>
          ) : (
            ""
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateData]);

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEnquiries = async () => {
    const enq = await fetchAll(paginateData);
    setEnquiries(enq);
    if (enq) {
      setTotalRecords(enq.length);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiry</CardTitle>
        <div className="insurance-add-btn">
          {isAllowed(permissions.enquiry, scopes.create) ? (
            <Button.Ripple
              tag={Link}
              to={`${match.path}/add`}
              className="mr-1"
              color="primary"
              outline
            >
              Add Enquiry
            </Button.Ripple>
          ) : (
            " "
          )}
        </div>
      </CardHeader>
      <CardBody>
        <DatatableServer
          data={enquiries}
          columns={columns}
          totalRows={totalRecords}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
      </CardBody>
    </Card>
  );
};

export default EnquiryList;
