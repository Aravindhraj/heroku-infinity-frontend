import React, { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../../services/product.service";
import { Card, CardHeader, CardTitle, Button, CardBody } from "reactstrap";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import { Link } from "react-router-dom";
import { Edit, Trash } from "react-feather";
import SweetAlert from "react-bootstrap-sweetalert";
import { DatatableServer } from "../../components/datatable-server/datatable-server";
const Products = ({ match }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
    },
    {
      name: "Status",
      selector: "id",
      sortable: false,
      cell: (item) =>
        item.status ? (
          <Chip className="mr-1" color="primary" text="Active" />
        ) : (
          <Chip className="mr-1" color="danger" text="Inactive" />
        ),
    },
    {
      name: "Actions",
      selector: "id",
      sortable: false,
      cell: (item) => (
        <div className="data-list-action">
          <Link to={`${match.path}/${item.id}`}>
            <Edit className="cursor-pointer mr-1" size={20} />
          </Link>

          <Link to="#" onClick={() => showDeleteAlert(item.id)}>
            <Trash className="cursor-pointer mr-1" size={20} />
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getProductsData();
  }, [paginateData]);

  const getProductsData = async () => {
    const data = await getProducts(paginateData);
    if (data.records && data.total) {
      setProducts(data.records);
      setTotal(data.total);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShowAlert(false);
  };

  const onConfirm = async () => {
    const res = await deleteProduct(deleteId);
    if (res && res["success"]) {
      setPaginateData({ ...paginateData, start: 1 });
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <div className="user-add-btn">
            <Button.Ripple
              className="mr-1"
              color="primary"
              tag={Link}
              to={`${match.path}/add`}
              outline
            >
              Add Product
            </Button.Ripple>
          </div>
        </CardHeader>
        <CardBody>
          <DatatableServer
            data={products}
            columns={columns}
            totalRows={total}
            paginateData={paginateData}
            setPaginateData={setPaginateData}
          />
        </CardBody>
      </Card>
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
    </>
  );
};

export default Products;
