import React, { useState, useEffect } from 'react';
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
import { getFinances, deleteFinance } from "../../../services/finance.service";


const FinanceList = ({ match }) => {
  const [fincances, setFinances] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchFinances = async () => {
    const res = await getFinances();
    if (res) {
      setFinances(res);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const onConfirm = async () => {
    const res = await deleteFinance(deleteId);
    if (res && res["success"]) {
      fetchFinances();
      setDeleteId(null);
      setShow(false);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShow(false);
  };

  const deleteFinanceFn = id => {
    if (id) {
      setDeleteId(id);
      setShow(true);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance</CardTitle>
        <div className="insurance-add-btn">
          <Button.Ripple
            tag={Link}
            to={`${match.path}/add`}
            className="mr-1"
            color="primary"
            outline
          >
            Add Finance
          </Button.Ripple>
        </div>
      </CardHeader>
      <CardBody>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fincances.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  {item.name}
                </td>
                <td>{item.provider}</td>
                <td>{item.status ? 'Active' : 'In-Active'}</td>
                <td>
                  <div className="data-list-action">
                    <Link
                      to={`${match.path}/${item.id}`}
                      href={`${match.path}/${item.id}`}
                    >
                      <Edit className="cursor-pointer mr-1" size={20} />
                    </Link>
                    <Link to="#" onClick={() => deleteFinanceFn(item.id)}>
                      <Trash className="cursor-pointer mr-1" size={20}></Trash>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <SweetAlert
          warning
          showCancel
          reverseButtons
          show={show}
          title={"Are You Sure?"}
          onConfirm={onConfirm}
          onCancel={onCancel}
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
        >
          You won't be able to revert this!
        </SweetAlert>
      </CardBody>
    </Card>
  );
}

export default FinanceList;