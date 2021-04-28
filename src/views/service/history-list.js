import React, { useEffect, useState } from "react";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";
import { Card, CardTitle, Button, CardBody, CardHeader } from "reactstrap";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import { permissions, scopes } from "../../configs/permissionsConfig";
import { isAllowed } from "../../helper/general.helper";
import { getAllServiceHistory, getServiceHistByCustomerId } from "../../services/service-history.service";
import { getAllServiceSchedule, getServiceScheduleByCustomerId } from "../../services/service-schedule.service";

import * as moment from "moment";

import { store } from "../../redux/storeConfig/store";
import { getUser } from "../../services/users.service";


const Service = ({ match }) => {
  const user = store.getState().auth.user;

  const [serviceHistory, setServiceHisory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginateData, setPaginateData] = useState({
    start: 1,
    perPage: 10,
    sortBy: "id",
    sortMode: "asc",
    search: "",
  });

  const [changedParts, setChangedParts] = useState([]);
  const [totalChangedPartRecords, setTotalChangedPartRecords] = useState(0);
  const [paginateChangedPartData, setPaginateChangedPartData] = useState({
    start: 1,
    perPage: 10,
    sortBy: "id",
    sortMode: "asc",
    search: "",
  });

  const [serviceSchedule, setServiceSchedule] = useState([]);
  const [totalScheduleRecords, setTotalScheduleRecords] = useState(0);
  const [paginateScheduleData, setPaginateScheduleData] = useState({
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
      name: "Service Round",
      sortable: true,
      selector: "service_round",
    },
    {
      name: "Problem",
      sortable: true,
      selector: "problem",
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
      name: "Service Date",
      selector: "service_date",
      sortable: true,
      cell: (item) => moment(item.service_date).format("D MMM, YYYY"),
    },
    {
      name: "Serviced By",
      selector: "serviced_by",
      sortable: true,
      cell: (item) =>
        <span>{item.serviced_by_data.firstname} {item.serviced_by_data.lastname}
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
        isAllowed(permissions.service, scopes.edit) ? (
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


  const changedPartcolumns = [
    {
      name: "#",
      sortable: false,
      selector: "id",
    },
    {
      name: "Spare Part",
      selector: "changed_part",
      sortable: true,
      cell: (item) => item.spare_part_data ?
        (<span>{item.spare_part_data.name}
        </span>) : "",
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
      name: "Changed On",
      selector: "service_date",
      sortable: true,
      cell: (item) => moment(item.service_date).format("D MMM, YYYY"),
    },
    {
      name: "Customer",
      selector: "customer_data",
      sortable: true,
      cell: (item) =>
        <span>
          {item.customer_data.firstname} {item.customer_data.lastname}
        </span>,
    }
  ];

  const scheduleColumns = [
    {
      name: "#",
      sortable: false,
      selector: "id",
    },
    {
      name: "Service Round",
      sortable: true,
      selector: "service_round",
    },
    {
      name: "Service Date",
      selector: "service_date",
      sortable: true,
      cell: (item) => moment(item.service_date).format("D MMM, YYYY"),
    },
    {
      name: "Service Time",
      sortable: true,
      selector: "service_time",
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
      name: "Service Type",
      sortable: true,
      selector: "service_type",
    },

    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) =>
        isAllowed(permissions.service, scopes.edit) ? (
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

    if (user.role.name != 'Customer') {
      fetchAllServiceHistory();
    }
    else {
      fetchServiceHistByCustomerId(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateData]);

  useEffect(() => {
    if (user.role.name != 'Customer') {
      fetchAllServiceSchedule();
    }
    else {
      fetchServiceScheduleByCustomerId(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateScheduleData]);


  const setChangedPartFromHistory = async (serviceHistory) => {
    console.log(serviceHistory);
    const temp = serviceHistory.filter((hist) => hist.spare_part_data && hist.spare_part_data != "")
    setChangedParts(temp);
    setTotalChangedPartRecords(temp.length);
  }

  const fetchAllServiceHistory = async () => {
    const serviceHistory = await getAllServiceHistory(paginateData);
    setServiceHisory(serviceHistory);
    if (serviceHistory) {
      setTotalRecords(serviceHistory.length);
      setChangedPartFromHistory(serviceHistory);
    }
  };

  const fetchServiceHistByCustomerId = async (cust_id) => {
    const serviceHistory = await getServiceHistByCustomerId(paginateData, cust_id);
    setServiceHisory(serviceHistory);
    if (serviceHistory) {
      setTotalRecords(serviceHistory.length);
      setChangedPartFromHistory(serviceHistory);
    }
  };

  const fetchAllServiceSchedule = async () => {
    const serviceSchedule = await getAllServiceSchedule(paginateScheduleData);

    setServiceSchedule(serviceSchedule);
    if (serviceSchedule) {
      setTotalScheduleRecords(serviceSchedule.length);
    }
  };

  const fetchServiceScheduleByCustomerId = async (cust_id) => {
    const serviceSchedule = await getServiceScheduleByCustomerId(paginateScheduleData, cust_id);
    setServiceSchedule(serviceSchedule);
    if (serviceSchedule) {
      setTotalScheduleRecords(serviceSchedule.length);
    }
  };

  return (
    <div><Card>
      <CardHeader>
        <CardTitle>Service History</CardTitle>
        {isAllowed(permissions.service, scopes.create) ? (
          <div className="insurance-add-btn">
            <Button.Ripple
              tag={Link}
              to={`${match.path}/add`}
              className="mr-1"
              color="primary"
              outline
            >
              Add Service History
            </Button.Ripple>
          </div>
        ) : (
            ""
          )}
      </CardHeader>
      <CardBody>
        <DatatableServer
          data={serviceHistory}
          columns={columns}
          totalRows={totalRecords}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
      </CardBody>
    </Card >


    <Card>
        <CardHeader>
          <CardTitle>Changed Parts</CardTitle>
          {/* {isAllowed(permissions.service, scopes.create) ? (
            <div className="insurance-add-btn">
              <Button.Ripple
                tag={Link}
                to={`${match.path}/add`}
                className="mr-1"
                color="primary"
                outline
              >
                Add Changed Part
            </Button.Ripple>
            </div>
          ) : (
              ""
            )} */}
        </CardHeader>
        <CardBody>
          <DatatableServer
            data={changedParts}
            columns={changedPartcolumns}
            totalRows={totalChangedPartRecords}
            paginateData={paginateChangedPartData}
            setPaginateData={setPaginateChangedPartData}
          />
        </CardBody>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Upcoming Service Schedule</CardTitle>
          {isAllowed(permissions.service, scopes.create) ? (
            <div className="insurance-add-btn">
              <Button.Ripple
                tag={Link}
                to={`${match.path}/schedule/add`}
                className="mr-1"
                color="primary"
                outline
              >
                Add Service Date
            </Button.Ripple>
            </div>
          ) : (
              ""
            )}
        </CardHeader>
        <CardBody>
          <DatatableServer
            data={serviceSchedule}
            columns={scheduleColumns}
            totalRows={totalScheduleRecords}
            paginateData={paginateScheduleData}
            setPaginateData={setPaginateScheduleData}
          />
        </CardBody>
      </Card> */}

    </div >
  );
};

export default Service;
