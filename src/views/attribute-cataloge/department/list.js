import React, { useState, useEffect } from "react";
import {
  Table,
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Edit, Trash } from "react-feather";
import SweetAlert from "react-bootstrap-sweetalert";
import classnames from "classnames";
import "../../../assets/scss/pages/data-list.scss";
import {
  getDepartments,
  deleteDepartment,
} from "../../../services/department.service";
import DepartmentForm from "./form";

const DepartmentList = ({ match }) => {
  const [departments, setDepartments] = useState([]);
  const [showAlert, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [sidebar, setSidebar] = useState(false);

  const fetchDepartments = async () => {
    const res = await getDepartments();
    if (res) {
      setDepartments(res);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onConfirm = async () => {
    const res = await deleteDepartment(deleteId);
    if (res && res["success"]) {
      fetchDepartments();
      setDeleteId(null);
      setShow(false);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShow(false);
  };

  const deleteDepartmentFn = (id) => {
    if (id) {
      setDeleteId(id);
      setShow(true);
    }
  };

  const handleSidebar = (boolean1, addNew = {}) => {
    setSidebar(boolean1);
    if (Object.keys(addNew).length === 0) {
      setEditRow(null);
    } else {
      setEditRow(addNew);
    }
  };

  return (
    <div className={`data-list thumb-view`}>
      <Card>
        <CardHeader>
          <CardTitle>Department</CardTitle>
          <div className="insurance-add-btn">
            <Button.Ripple
              onClick={handleSidebar}
              className="mr-1"
              color="primary"
              outline
            >
              Add Department
            </Button.Ripple>
          </div>
        </CardHeader>
        <CardBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Team Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                  <td>{item.status ? "Active" : "In-Active"}</td>
                  <td>
                    <div className="data-list-action">
                      <Link to="#" onClick={() => handleSidebar(true, item)}>
                        <Edit className="cursor-pointer mr-1" size={20} />
                      </Link>
                      <Link to="#" onClick={() => deleteDepartmentFn(item.id)}>
                        <Trash
                          className="cursor-pointer mr-1"
                          size={20}
                        ></Trash>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <DepartmentForm
        show={sidebar}
        data={editRow}
        handleSidebar={(val) => {
          handleSidebar(val);
        }}
        getDepartments={fetchDepartments}
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

export default DepartmentList;
