import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import PageLayout from "../../components/PageLayout";
import { showLoading, hideLoading } from "../../redux/loadSlice";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    dispatch(showLoading());
    try {
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Navn",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Oprettet",
      dataIndex: "createdAt",
      // transform the date before displaying it in the table
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Handlinger",
      dataIndex: "actions",
      className: "hide-on-mobile",

      render: (record, text) => (
        <div className="flex">
          <h1 className="anchor">Blokér</h1>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <h1 className="page-title">Brugere</h1>
      <hr className="hr" />
      <Table columns={columns} dataSource={users} bordered />
    </PageLayout>
  );
};

export default UserList;
