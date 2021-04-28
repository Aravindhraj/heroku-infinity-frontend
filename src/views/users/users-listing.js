import React, { useState, useEffect } from "react";
import {
  Table,
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  Button,
} from "reactstrap";
import { Edit, Trash } from "react-feather";
import { Link } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { getUsers, deleteUser } from "../../services/users.service";

const UsersListing = ({ match }) => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getUsers();
    if (res) {
      setUsers(res);
    }
  };

  const onConfirm = async () => {
    const res = await deleteUser(deleteId);
    if (res && res["success"]) {
      fetchUsers();
      setDeleteId(null);
      setShow(false);
    }
  };

  const onCancel = () => {
    setDeleteId(null);
    setShow(false);
  };

  const deleteUserFn = (id) => {
    if (id) {
      setDeleteId(id);
      setShow(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <div className="user-add-btn">
          <Button.Ripple
            tag={Link}
            to={`${match.path}/add`}
            className="mr-1"
            color="primary"
            outline
          >
            Add User
          </Button.Ripple>
        </div>
      </CardHeader>
      <CardBody>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  {item.firstname} {item.lastname}
                </td>
                <td>{item.email}</td>
                <td>{item.roles[0]["name"]}</td>
                <td>{item.status ? 'Active' : 'In-Active'}</td>
                <td>
                  <div className="data-list-action">
                    <Link
                      to={`${match.path}/${item.id}`}
                      href={`${match.path}/${item.id}`}
                    >
                      <Edit className="cursor-pointer mr-1" size={20} />
                    </Link>
                    <Link to="#" onClick={() => deleteUserFn(item.id)}>
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
};

export default UsersListing;
