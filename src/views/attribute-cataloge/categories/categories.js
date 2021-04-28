import React, { useState, useEffect } from "react";
import {
  getCategories,
  deleteCategory,
} from "../../../services/category.service";
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
import CategoryAdd from "./category-add";
import classnames from "classnames";
import "../../../assets/scss/pages/data-list.scss";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";

const Categories = ({ match }) => {
  const [categories, setCategories] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getCategoriesData();
  }, []);

  const getCategoriesData = async () => {
    const data = await getCategories();
    setCategories(data);
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
    const res = await deleteCategory(deleteId);
    if (res && res["success"]) {
      getCategoriesData();
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
          <CardTitle>Categories</CardTitle>
          <div className="user-add-btn">
            {/* <Link to={`${match.path}/add`}> */}
            <Button.Ripple
              className="mr-1"
              color="primary"
              onClick={handleSidebar}
              outline
            >
              Add Category
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
                <th>Icon</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.icon}</td>
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
      <CategoryAdd
        show={sidebar}
        data={currentRow}
        handleSidebar={handleSidebar}
        getCategoriesData={getCategoriesData}
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

export default Categories;
