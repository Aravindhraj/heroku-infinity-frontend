import React, { useEffect, useState } from "react";
import { Edit, Trash } from "react-feather";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
} from "reactstrap";
import Chip from "../../../components/@vuexy/chips/ChipComponent";
import GeneralForm from "./general-form";
import SweetAlert from "react-bootstrap-sweetalert";

const GeneralListing = ({
  title,
  recordType,
  getRecords,
  deleteRecord,
  saveRecord,
}) => {
  const [tableData, setTableData] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    const data = await getRecords();
    if (data) {
      setTableData(data);
    }
  };

  const handleSidebar = (boolean, addNew = {}) => {
    setSidebar(boolean);
    if (Object.keys(addNew).length === 0) {
      setCurrentRow(null);
    } else {
      setCurrentRow(addNew);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShowAlert(false);
  };

  const onConfirm = async () => {
    const res = await deleteRecord(deleteId);
    if (res && res["success"]) {
      getTableData();
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

  return (
    <div className={`data-list thumb-view`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="user-add-btn">
            <Button.Ripple
              className="mr-1"
              color="primary"
              onClick={handleSidebar}
              outline
            >
              Add {recordType}
            </Button.Ripple>
          </div>
        </CardHeader>
        <CardBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>
                    {item.status ? (
                      <Chip className="mr-1" color="primary" text="Active" />
                    ) : (
                        <Chip className="mr-1" color="danger" text="Inactive" />
                      )}
                  </td>
                  <td>
                    <div className="data-list-action">
                      <Link to="#" onClick={() => handleSidebar(true, item)}>
                        <Edit className="cursor-pointer mr-1" size={20} />
                      </Link>

                      <Link to="#" onClick={() => showDeleteAlert(item.id)}>
                        <Trash className="cursor-pointer mr-1" size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <GeneralForm
        show={sidebar}
        data={currentRow}
        handleSidebar={handleSidebar}
        saveRecord={saveRecord}
        getTableData={getTableData}
        recordType={recordType}
      />
      <div
        className={classnames("data-list-overlay", {
          show: sidebar,
        })}
        onClick={() => setSidebar(false)}
      />
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
    </div>
  );
};

export default GeneralListing;
