import React, { useEffect, useState } from "react";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";
import { Card, CardTitle, Button, CardBody, CardHeader } from "reactstrap";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
import { permissions, scopes } from "../../configs/permissionsConfig";
import { isAllowed } from "../../helper/general.helper";
import { getAllServiceSchedule, getServiceScheduleByCustomerId } from "../../services/service-schedule.service";

import * as moment from "moment";

import { store } from "../../redux/storeConfig/store";

const ServiceSchedule = ({ match }) => {
    const user = store.getState().auth.user;

    const [serviceSchedule, setServiceSchedule] = useState([]);
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
        if (user.role.name !== 'Customer') {
            fetchAllServiceSchedule();
        }
        else {
            fetchServiceScheduleByCustomerId(user._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginateData]);

    const fetchAllServiceSchedule = async () => {
        const serviceSchedule = await getAllServiceSchedule(paginateData);

        setServiceSchedule(serviceSchedule);
        if (serviceSchedule) {
            setTotalRecords(serviceSchedule.length);
        }
    };

    const fetchServiceScheduleByCustomerId = async (cust_id) => {
        const serviceSchedule = await getServiceScheduleByCustomerId(paginateData, cust_id);
        setServiceSchedule(serviceSchedule);
        if (serviceSchedule) {
            setTotalRecords(serviceSchedule.length);
        }
    };

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Service Schedule</CardTitle>
                    {isAllowed(permissions.service, scopes.create) ? (
                        <div className="insurance-add-btn">
                            <Button.Ripple
                                tag={Link}
                                to={`${match.path}/add`}
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
                        columns={columns}
                        totalRows={totalRecords}
                        paginateData={paginateData}
                        setPaginateData={setPaginateData}
                    />
                </CardBody>
            </Card>
    );
};

export default ServiceSchedule;
