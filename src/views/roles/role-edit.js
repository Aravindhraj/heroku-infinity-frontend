import React, { useEffect, useState } from "react";
import {
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  Table,
  Button,
} from "reactstrap";
import {
  getRoleData,
  getPermissions,
  editRole,
} from "../../services/role-permission.service";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check } from "react-feather";

const RoleEdit = ({ match, history }) => {
  const id = match.params.id;
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const role = await getRoleData(id);
      const existingPermissions = role.permissions;
      const permissions = await getPermissions();
      const rolePermissions = {};
      permissions.forEach((item) => {
        const permissionRow = existingPermissions.filter(
          (per) => per.permission_id === item.id
        );
        if (permissionRow.length) {
          rolePermissions[item.name] = {
            permission_id: item.id,
            read: permissionRow[0]["read"],
            create: permissionRow[0]["create"],
            edit: permissionRow[0]["edit"],
            delete: permissionRow[0]["delete"],
          };
        } else {
          rolePermissions[item.name] = {
            permission_id: item.id,
            read: 0,
            create: 0,
            edit: 0,
            delete: 0,
          };
        }
      });
      setRolePermissions(rolePermissions);
      setRoleName(role.name);
      setPermissions(permissions);
    };
    fetchData();
  }, [id]);

  const onChangePermission = (isChecked, permission, type) => {
    const tempRolePermissions = { ...rolePermissions };
    tempRolePermissions[permission][type] = isChecked;
    setRolePermissions(tempRolePermissions);
  };

  const onSubmit = async () => {
    const postData = {};
    postData["role_id"] = match.params.id;
    postData["permissions"] = rolePermissions;
    await editRole(postData);
    history.push("/roles");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Role</CardTitle>
      </CardHeader>
      <CardBody>
        <h4>Role : {roleName}</h4>
        <Table responsive>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Read</th>
              <th>Create</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{item.name}</th>
                <td>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    defaultChecked={rolePermissions[item.name]["read"]}
                    onChange={(e) =>
                      onChangePermission(e.target.checked, item.name, "read")
                    }
                  />
                </td>
                <td>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    defaultChecked={rolePermissions[item.name]["create"]}
                    onChange={(e) =>
                      onChangePermission(e.target.checked, item.name, "create")
                    }
                  />
                </td>
                <td>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    defaultChecked={rolePermissions[item.name]["edit"]}
                    onChange={(e) =>
                      onChangePermission(e.target.checked, item.name, "edit")
                    }
                  />
                </td>
                <td>
                  <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    defaultChecked={rolePermissions[item.name]["delete"]}
                    onChange={(e) =>
                      onChangePermission(e.target.checked, item.name, "delete")
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center">
          <Button.Ripple
            color="primary"
            className="mt-1"
            outline
            onClick={onSubmit}
          >
            Submit
          </Button.Ripple>
        </div>
      </CardBody>
    </Card>
  );
};

export default RoleEdit;
