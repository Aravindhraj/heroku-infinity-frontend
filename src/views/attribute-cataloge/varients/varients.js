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
import { deleteVarient, getVarients } from "../../../services/varient.service";
import VarientForm from "./varient-form";
import SweetAlert from "react-bootstrap-sweetalert";

const Varients = () => {
  const [varients, setVarients] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getVarientsData();
  }, []);

  const getVarientsData = async () => {
    const data = await getVarients();
    setVarients(data);
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
    const res = await deleteVarient(deleteId);
    if (res && res["success"]) {
      getVarientsData();
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
          <CardTitle>Varients</CardTitle>
          <div className="user-add-btn">
            <Button.Ripple
              className="mr-1"
              color="primary"
              onClick={handleSidebar}
              outline
            >
              Add Varient
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
              {varients.map((item, index) => (
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
      <VarientForm
        show={sidebar}
        data={currentRow}
        handleSidebar={handleSidebar}
        getVarientsData={getVarientsData}
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

export default Varients;
