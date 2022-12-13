import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import PageLayout from "../components/PageLayout";
import { showLoading, hideLoading } from "../redux/loadSlice";

const Appointments = () => {
  // state variable to hold appointment data
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  // retrieve appointment data from API
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/user/get-appointments-by-user-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      // column header
      title: "Læge",
      dataIndex: "name",
      // render the cell contents
      render: (index, record) => (
        <span
          key={index}
        >{`${record.doctorInfo.firstName} ${record.doctorInfo.lastName}`}</span>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      render: (index, record) => (
        <span key={index}>{record.doctorInfo.phoneNumber}</span>
      ),
    },
    {
      title: "Dato & Tid",
      dataIndex: "createdAt",
      render: (index, record) => (
        <span key={index}>
          {moment(record.date).format("DD-MM-YYYY")}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    // fetch the appointments data when the component is first rendered
    getAppointmentsData();
  }, []);

  return (
    <PageLayout>
      <h1 className="page-title">Aftaler</h1>
      <hr className="hr" />
      <Table columns={columns} dataSource={appointments} />
    </PageLayout>
  );
};

export default Appointments;
