import React, { useState, useEffect } from "react";
import { Table, CardBody, CardHeader, CardTitle, Card } from "reactstrap";
import { getRoles } from "../../services/role-permission.service";
import { Edit } from "react-feather";
import { Link } from "react-router-dom";

const RolesListing = ({ match }) => {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    let unmounted = false;
    const fetchRoles = async () => {
      if (!unmounted) {
        const res = await getRoles();
        setRoles(res);
      }
    };
    fetchRoles();
    return () => {
      unmounted = true;
    }
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
      </CardHeader>
      <CardBody>
        <Table striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 &&
              roles.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>
                    <div className="data-list-action">
                      <Link to={`${match.path}/${item.id}`}>
                        <Edit className="cursor-pointer mr-1" size={20} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RolesListing;
