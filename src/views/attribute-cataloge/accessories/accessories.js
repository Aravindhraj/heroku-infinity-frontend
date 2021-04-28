import React, { useState, useEffect } from "react";
import {
  getAccessories,
  deleteAccessory,
} from "../../../services/accessories.service";
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  CardBody,
  Table,
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import Chip from "../../../components/@vuexy/chips/ChipComponent";
import classnames from "classnames";
import "../../../assets/scss/pages/data-list.scss";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import AccessoriesForm from "./accessories-form";

const Accessories = ({ match }) => {
  const [accessories, setAccessories] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getAccessoriesData();
  }, []);

  const getAccessoriesData = async () => {
    const data = await getAccessories();
    setAccessories(data);
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
    const res = await deleteAccessory(deleteId);
    if (res && res["success"]) {
      getAccessoriesData();
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
          <CardTitle>Accessories</CardTitle>
          <div className="user-add-btn">
            {/* <Link to={`${match.path}/add`}> */}
            <Button.Ripple
              className="mr-1"
              color="primary"
              onClick={handleSidebar}
              outline
            >
              Add Accessory
            </Button.Ripple>
            {/* </Link> */}
          </div>
        </CardHeader>
        <CardBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    {item.status ? (
                      <Chip className="mr-1" color="primary" text="Active" />
                    ) : (
                      <Chip className="mr-1" color="danger" text="Inactive" />
                    )}
                  </td>
                  <td>
                    <div className="data-list-action">
                      {/* <Link to={`${match.path}/${item.id}`}> */}

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
      <AccessoriesForm
        show={sidebar}
        data={currentRow}
        handleSidebar={handleSidebar}
        getAccessoriesData={getAccessoriesData}
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

export default Accessories;
